<template>
  <n-layout>
    <script-drawer />
    <n-layout-content content-style="padding: 0px;">
      <vue-p5 ref="p5vue"
        class="center-block"
        :c="canvasClass"
        @setup="setup" 
        @draw="draw"
        @loading="drawLoading"
        @mousePressed="mousePressed"
        @mouseReleased="mouseReleased"
        @scroll="scroll"
        @pinchStart="pinchStart"
        @pinchScale="pinchScale"
        @pinchStop="pinchStop"
      />
    </n-layout-content>
  </n-layout>
</template>

<script>
import VueP5 from './VueP5.vue'
import ScriptDrawer from './ScriptDrawer.vue'
import { canvasStore, sessionStore, UIStore } from './../store.js'
import VueAxios from './common/http-common'
import GridSection from './common/GridSection'
import CanvasPreview from './common/CanvasPreview'
import {NLayout, NLayoutContent} from 'naive-ui'
import {useMessage} from 'naive-ui'
//import axios from 'axios';

export default {
  name: "game",
  mixins: [VueAxios],
  components: {
    VueP5,
    ScriptDrawer,
    NLayout,
    NLayoutContent,
  },
  created() {
    this.emitter.on('addToPreview', (v) => {
      let i = v.x + (canvasStore.gridXX * v.y)
      this.tempPixels[i] = v.c
    })
    this.emitter.on('clearPreview', (v) => {
      let i = v.x + (canvasStore.gridXX * v.y)
      delete this.tempPixels[i]
    })
    this.emitter.on('placePixel', (data) => {
      this.spp(data.x,data.y,data.c)
    })
    window.addEventListener('wheel', this.removeScroll,{ passive: false })
  },
  unmounted() {
    window.removeEventListener('wheel', this.removeScroll, false)
  },
  mounted() {
    this.$refs.p5vue.loading()
    this.p5 = this.$refs.p5vue.p5
    this.getCanvas()

    window.Echo.channel("pixel-change-"+canvasStore.canvasId).listen('PixelEvent', (e) => {
      let x = parseInt(e.x);
      let y = parseInt(e.y);
      let i = x + (canvasStore.gridXX * y)

      this.drawPixel(x, y, e.color)
      if(this.tempPixels[i] != undefined) {
        delete this.tempPixels[i]
      }
    })
  },
  data () {
    return {
      p5: null,
      canvasStore,
      sessionStore,
      UIStore,
      canvasClass: 'p5-main-canvas',
      gridSections: [],
      grab: {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
      },
      pixels: [],
      tempPixels: [],
      speed: 2,
      touchScaleStart: 1,
      screenOff: {
        x: 0,
        y: 0
      },
      screenOffset: {
        x: 0,
        y: 0,
      },
      screenMove: {
        x: 0,
        y: 0
      },
      c: null,
      echo: null,
      sf: 1,
      oldSf: 1,
      mouseDown: false,
      center: {
        x: 0,
        y: 0
      },
      lg: { // loading grid
        x: { // positining of vertical lines
          min: 0,
          max: 0
        },
        y: { // positining of horizontal lines
          min: 0,
          max: 0
        },
        size: 4, // size of grid
        a: 0.0, // progress in animation
        speed: 0.01, // animation speed
        delay: 0.2, // delay between lines
        amp: 5 // amplitude of oscilation
      },
      message: useMessage(),
      active: false, // color and login drawer
      sd: {
        active: false, // script drawer,
      },
      update: {
        points: true,
        preview: true
      },
      pixelOwner: {},
      hoverPixel: {
        x:0,
        y:0
      },
      hoverCount: 0,
      getPixel: false,
      messageReactive: undefined,
      lastUpdate: new Date()
    }
  },
  methods: {
    async getCanvas() {
      this.HTTP
      .get('canvas/'+canvasStore.canvasId)
      .then(response => {
        let data = response.data[0]
        console.log("got data")
        canvasStore.gridXX = data.width
        canvasStore.gridYY = data.height
        canvasStore.isPrivate = data.private
        canvasStore.isScriptAllowed = data.script_allowed
        canvasStore.isManualAllowed = data.manual_allowed
        canvasStore.ss = 100
        canvasStore.tileSize = data.width / 100
        canvasStore.name = data.label
        this.initCanvas()

        // create sections
        for(let y = 0; y < canvasStore.gridXX / canvasStore.ss; y++) {
          for(let x = 0; x < canvasStore.gridXX / canvasStore.ss; x++) {
            this.gridSections.push(new GridSection(this.p5, x, y, canvasStore.ss, canvasStore.s, canvasStore.gridXX))
          }
        }
        this.getPixels()
      })
    },
    async getPixels() {
      this.HTTP
      .get('pixels/'+canvasStore.canvasId)
      .then(response => {
        for (const key in response.data) {
          if(key < canvasStore.gridXX * canvasStore.gridYY && key >= 0) {
            this.placePixelInSection(key, response.data[key])
          }
        }
        for(let i = 0; i < this.gridSections.length; i++) {
          this.gridSections[i].draw()
        }
        this.savePreview()
        this.$refs.p5vue.finishedLoading()
      })
    },
    changeColor(c) {
      canvasStore.selectedColor = c
    },
    initCanvas() {
      let widthDiff = this.p5.windowWidth / canvasStore.gridXX
      let heightDiff = this.p5.windowHeight / canvasStore.gridYY
      let diff = widthDiff < heightDiff ? widthDiff : heightDiff
      this.sf = diff
      this.screenOff.x = this.center.x - (canvasStore.gridXX / 2)
      this.screenOff.y = this.center.y - (canvasStore.gridYY / 2)
    },
    setup(p5) {
      this.c = p5.color('#ffffff')
      this.canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
      this.canvas.class(this.canvasClass)
      p5.noSmooth()
      p5.resizeCanvas(p5.windowWidth,p5.windowHeight)
      this.center.x = p5.windowWidth / 2;
      this.center.y = (p5.windowHeight) / 2;

      let sgs = canvasStore.s * this.lg.size / 2
      this.lg.x.min = this.center.x - sgs
      this.lg.x.max = this.center.x + sgs
      this.lg.y.min = this.center.y - sgs
      this.lg.y.max = this.center.y + sgs

      this.lg.a = 0.0;
    },
    // Draw and animate the loading screen
    drawLoading(p5) {
      let s = 1 / this.lg.speed
      p5.background(255);
      
      for(let x = 0; x < this.lg.size + 1; x++) {
        let move =  p5.sin(this.lg.a + (x * this.lg.delay)) * this.lg.amp
        p5.line(this.lg.x.min + (x * canvasStore.s), move + this.lg.y.min, this.lg.x.min + (x * canvasStore.s), move + this.lg.y.max);
      }
      for(let y = 0; y < this.lg.size + 1;y++) {
        let move =  p5.sin(this.lg.a + (y * this.lg.delay)) * this.lg.amp
        p5.line(move + this.lg.x.min,this.lg.y.min + + (y * canvasStore.s), move + this.lg.x.max, this.lg.y.min + (y * canvasStore.s));
      }
      this.lg.a += p5.TWO_PI / s

      p5.textSize(24);
      p5.text('loading', this.center.x - 38, this.center.y + 80);
    },
    draw (p5) {
      //drag canvas
      if(this.mouseDown) {
        this.screenOff.x = (p5.mouseX - this.grab.x)  / this.sf
        this.screenOff.y = (p5.mouseY - this.grab.y) / this.sf
      }

      let sfChange = this.sf - this.oldSf
      this.screenOffset.x = this.screenOff.x - ((-this.screenOff.x + this.center.x) * sfChange)
      this.screenOffset.y = this.screenOff.y - ((-this.screenOff.y + this.center.y) * sfChange)

      p5.translate(this.screenOffset.x, this.screenOffset.y)
      p5.scale(this.sf);

      // draw bg
      p5.background('#2C2C2C')
      p5.fill('#000000')
      p5.rect(0, 0, canvasStore.gridXX, canvasStore.gridYY);

      for(let i = 0; i < this.gridSections.length; i++) {
          this.gridSections[i].updatePosition()
      }

      if(this.update.preview) {
        // draw  temp pixels
        for (const key in this.tempPixels) {
          if (Object.hasOwnProperty.call(this.tempPixels, key)) {
            const color = this.tempPixels[key];

            const x = key % canvasStore.gridXX;
            const y = Math.floor(key / canvasStore.gridXX);

            // only render if in bounding box
            this.drawTempPixel(p5, x, y, color)
          }
        }
      }

      // mouse position
      let ratioX = (p5.mouseX - this.screenOffset.x)
      let ratioY = (p5.mouseY - this.screenOffset.y)
      // mouse position on grid
      let gridX = Math.floor(ratioX / this.sf)
      let gridY = Math.floor(ratioY / this.sf)
      // mouse position for tiles
      let tileX = Math.floor(ratioX / canvasStore.ss / this.sf)
      let tileY = Math.floor(ratioY / canvasStore.ss / this.sf)

      
      if(tileX < 0 || tileX > canvasStore.tileSize || tileY < 0 || tileY > canvasStore.tileSize) {
        return;
      } else {
        //let i = tileX + (10 * tileY)
        //this.gridSections[i].drawPreviewPixel(gridX, gridY, p5.color(store.selectedColor))
        this.c = p5.color(canvasStore.selectedColor)
        this.drawHoverPixel(p5, gridX, gridY, this.c)

      }

      /* logic to display pixel placer name */
      // check if pixel bellow mouse change
      if(!(this.hoverPixel.x == gridX && this.hoverPixel.y == gridY)) {
        if(this.hasPixel(gridX, gridY)) {
          this.hoverPixel.x = gridX
          this.hoverPixel.y = gridY
          this.hoverCount = 0
          this.getPixel = true
        } else {
          this.getPixel = false
          this.closeTT()
        }
      }
      
      // if there is a pixel bellow mouse update status of message...
      if(this.getPixel) {
        // .. based on how long you have been hovering over it
        if(this.hoverCount == 60) {
          this.getPixelOwner(gridX, gridY)
          this.getPixel = false
          this.hoverCount = 0
        } else if(this.hoverCount == 1) {
          this.loadNextPixelOwner(gridX, gridY)
        }
      }

      this.hoverCount++

      let now = new Date()
      if(this.messageReactive != undefined) {
        if((now.getTime() - this.lastUpdate.getTime()) / 1000 > 4) {
          this.closeTT()
        }
      }
    },
    mousePressed (p5) {
      this.grab.startX = p5.mouseX
      this.grab.startY = p5.mouseY
      // when mouse pressed
      // store the position of the initial grab and multiply the offset by the scale factore (to noralize?)
      this.grab.x = p5.mouseX - (this.screenOff.x * this.sf)
      this.grab.y = p5.mouseY - (this.screenOff.y * this.sf)
      this.screenMove.x = p5.mouseX;
      this.screenMove.y = p5.mouseY;
      this.mouseDown = true
    },
    mouseReleased (p5) {
      this.update.points = true
      this.mouseDown = false;
      let dragVector = p5.createVector(this.screenMove.x, this.screenMove.y);
      let ogVector = p5.createVector(p5.mouseX, p5.mouseY)
      if(dragVector.dist(ogVector) < 5) {
        if(sessionStore.token == '') {
          this.message.info(
              'Login or Register to place points',
              {
                keepAliveOnHover: true
              }
            )
          return
        }
        // mouse position
        let ratioX = (p5.mouseX - this.screenOffset.x)
        let ratioY = (p5.mouseY - this.screenOffset.y)
        // mouse position on grid
        let gridX = Math.floor(ratioX / this.sf)
        let gridY = Math.floor(ratioY / this.sf)

        if(gridX < 0 || gridX > canvasStore.gridXX || gridY < 0 || gridY > canvasStore.gridYY) {
          return;
        } else {
          if(canvasStore.isPainting) {
            this.c = p5.color(canvasStore.selectedColor)
            canvasStore.colorSelected()
            this.pp(gridX, gridY, true)
          } else {
            this.copyColor(gridX, gridY)
          }
        }
      }
    },
    pinchStart(touches) {
      this.mouseDown = false
      // get center point between two fingers
      this.touchScaleStart = Math.sqrt(Math.pow(touches[0].screenX - touches[1].screenX, 2) + Math.pow(touches[0].screenY - touches[1].screenY, 2))
    },
    pinchScale(touches) {
      let touchDist = Math.sqrt(Math.pow(touches[0].screenX - touches[1].screenX, 2) + Math.pow(touches[0].screenY - touches[1].screenY, 2))
      let diff = this.touchScaleStart / touchDist
      this.sf = ((1 - diff) + 1) * this.sf
      this.touchScaleStart = touchDist
    },
    pinchStop(touch) {
      console.log(touch.screenX, touch.screenY)
      // console.log(this.p5.mouseX, this.p5.mouseY)
    },
    scroll(e) {
      // this.update.points = false
      if (e.deltaY > 0) {
        this.sf *= 1.05;
      } else {
        this.sf *= 0.95;
      }
      //this.endScroll()
    },
    async endScroll() {
      await this.waitfor(100);
      this.update.points = true
    },
    waitfor(s) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
        }, s);
      });
    },
    placePixelInSection(key, color) {
      const x = key % canvasStore.gridXX
      const y = Math.floor(key / canvasStore.gridXX)
      const xSec = Math.floor(x / canvasStore.ss)
      const ySec = Math.floor(y / canvasStore.ss)
      let i = xSec + ((canvasStore.gridXX / canvasStore.ss) * ySec)
      this.gridSections[i].setPixel(key, color)
    },
    drawPixel(x, y, c) {
      const xSec = Math.floor(x / canvasStore.ss)
      const ySec = Math.floor(y / canvasStore.ss)
      let i = xSec + (canvasStore.tileSize * ySec)
      this.gridSections[i].drawPixel(x, y, c)
    },
    drawTempPixel(p5, x, y, c) {
      p5.strokeWeight(0)
      p5.fill(c)
      p5.square(x + (1 / 4), y + (1 / 4), (1 / 2))
    },
    drawHoverPixel(p5, x, y, c) {
      p5.strokeWeight(0)
      p5.fill(c)
      p5.square(x + (1/3), y + (1/3), 1/3)
    },
    spp(x,y,c) {
      this.c = this.p5.color(c)
      this.pp(x,y, false)
    },
    pp(x, y, isManual) {
      let c = this.rgbToHex(this.c.levels)
      this.tempPixels[x + (canvasStore.gridXX * y)] = c;
      const bodyFormData = new FormData()
      bodyFormData.append('x', x)
      bodyFormData.append('y', y)
      bodyFormData.append('color', c)
      bodyFormData.append('user_id', sessionStore.user.id)
      bodyFormData.append('is_manual', isManual ? 1 : 0)
      bodyFormData.append('canvas_id', canvasStore.canvasId)
      this.HTTP
        .post('pixels/add', bodyFormData, { headers: {"Authorization" : 'Bearer ' + sessionStore.token} })
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          let e = JSON.parse(error.request.response); 
          console.log(e.code, e.message)
        })
    },
    displayPixelOwner() {
      // check if we have value
      let msg
      let success
      if(this.pixelOwner != "") {
        msg = this.pixelOwner.name
        success = "success"
      } else {
        msg = "Unknown"
        success = "info"
      }
      if(this.messageReactive == undefined) {
        UIStore.messagePlacement = 'bottom'
        this.messageReactive = this.message.create(msg, {
          type: success,
          duration: 0,
        });
      } else {
        this.messageReactive.type = success
        this.messageReactive.content = msg
      }
    },
    closeTT() {
      if(this.messageReactive) {
        this.messageReactive.destroy();
        this.messageReactive =  undefined
      }
    },
    hasPixel(x, y) {
      let pI = x + (canvasStore.gridXX * y)
      const xSec = Math.floor(x / canvasStore.ss)
      const ySec = Math.floor(y / canvasStore.ss)
      let i = xSec + ((canvasStore.gridXX / canvasStore.ss) * ySec)
      if(this.gridSections.length > i) {
        return this.gridSections[i].hasPixelAtPosition(pI)
      }
      return false
    },
    getPixelOwner(x, y) {
      this.HTTP
        .get('pixel/user/' + canvasStore.canvasId + '/' + x + '/' + y)
        .then(response => {
          this.pixelOwner = response.data
          this.displayPixelOwner()
          this.lastUpdate = new Date()
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadNextPixelOwner() {
      if(this.messageReactive == undefined) {
        UIStore.messagePlacement = 'bottom'
        this.messageReactive = this.message.create('', {
          type: 'loading',
          duration: 0,
        });
      } else {
        this.messageReactive.type = 'loading'
      }
      this.lastUpdate = new Date()
    },
    rgbToHex(c) {
      return "#" + this.componentToHex(c[0]) + this.componentToHex(c[1]) + this.componentToHex(c[2])
    },
    componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    copyColor(x, y) {
      this.HTTP
        .get('pixel/color/'+ canvasStore.canvasId + '/' + x + '/' + y + '/', { headers: {"Authorization" : 'Bearer ' + sessionStore.token} })
        .then(response => {
          if(response.data != "") {
            let msg = "added color to swatches"
            if(this.messageReactive == undefined) {
              UIStore.messagePlacement = 'top'
              this.messageReactive = this.message.create(msg, {
                type: "success",
                duration: 0,
              });
            } else {
              this.messageReactive.type = "success"
              this.messageReactive.content = msg
            }
            canvasStore.selectedColor = response.data
            canvasStore.colorSelected()
          }
        })
        .catch(error => {
          let e = JSON.parse(error.request.response); 
          console.log(e.code, e.message)
        })
    },
    startScript() {
      this.$refs.scriptPlayer.startScript();
    },
    removeScroll(e) {
      //console.log("blocked")
      e.preventDefault()
    },
    savePreview() {
      let pixels = []
      for(let i = 0; i < this.gridSections.length; i++) {
        pixels = Object.assign([], pixels, this.gridSections[i].pixels)
      }
      let cPreview = new CanvasPreview(this.p5, pixels, canvasStore.gridXX, canvasStore.gridYY)
      let image = cPreview.start()
      const bodyFormData = new FormData()
      bodyFormData.append('width', canvasStore.gridXX)
      bodyFormData.append('height', canvasStore.gridYY)
      bodyFormData.append('name', 'canvas-'+ canvasStore.canvasId)
      bodyFormData.append('canvas_id', canvasStore.canvasId)
      bodyFormData.append('file', image.canvas.toDataURL())
      this.HTTP
        .post('add-preview', bodyFormData, { headers: {"Authorization" : 'Bearer ' + sessionStore.token} })
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  computed: {
    hasToken() {
      return canvasStore.token != ''
    },
    boundingBox() {
      const offX = -this.screenOffset.x / this.sf
      const offY = -this.screenOffset.y / this.sf
      const offDiffX = (this.center.x*2 - this.screenOffset.x) / this.sf
      const offDiffY = (this.center.y*2 - this.screenOffset.y) / this.sf
      return {
        l: Math.max(Math.floor(offX / canvasStore.s / canvasStore.ss) - 1, 0),
        r: Math.min(Math.floor(offDiffX / canvasStore.s / canvasStore.ss) + 1, 10),
        t: Math.max(Math.floor(offY / canvasStore.s/ canvasStore.ss) - 1, 0),
        b: Math.min(Math.floor(offDiffY / canvasStore.s/ canvasStore.ss) + 1, 10)
      }
    }
  }
}
</script>

<style>
#game-container {
  height: 100%;
  display: flex;
  flex-direction: row;
}
.scroll-container {
  height: 100px;
  overflow: scroll;
}
.swatch-container {
  display: flex;
  flex-wrap: wrap;
}
.center{
 justify-content: center;
}
.horizontal {
  display: flex;
}
.center-container {
  flex-direction: column;
  display: flex;
}
.center-block {
  max-width: 100%;
}
.static-container {
  position: fixed;
  bottom: 10px;
  right: 10px;
  top: 10px;
  left: 10px;
  height: 40px;
  display: flex;
  gap: 10px;
  justify-content: right;
}
.static-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #000000;
  border: none;
  color: white;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
}
.static-label {
  color: #000000;
  text-align: center;
  line-height: 44px;
  font-size: 20px;
}
body {
  margin: 0;
}
</style>