<template>
  <n-layout>
    <ScriptDrawer />
    <n-layout-content content-style="padding: 0px;">
      <VueP5 ref="p5vue"
        class="center-block"
        @setup="setup" 
        @draw="draw"
        @loading="drawLoading"
        @mousePressed="mousePressed"
        @mouseReleased="mouseReleased"
        @scroll="scroll"
      />
      <CanvasOverlay 
        @spp="spp"
      />
    </n-layout-content>
    <MenuDrawer />
    <LoginModal
        ref="loginModal"
      />
  </n-layout>
</template>

<script>
import VueP5 from './VueP5.vue'
import ScriptDrawer from './ScriptDrawer.vue'
import MenuDrawer from './MenuDrawer.vue'
import CanvasOverlay from './CanvasOverlay.vue'
//mport VueAxios from './VueAxios.vue'
import { store } from './../store.js'
import LoginModal from './LoginModal.vue'
import VueAxios from './common/http-common'
import GridSection from './common/GridSection.js'
import {NLayout, NLayoutContent} from 'naive-ui'
import {useMessage} from 'naive-ui'
//import axios from 'axios';

export default {
  name: "game",
  mixins: [VueAxios],
  components: {
    VueP5,
    LoginModal,
    ScriptDrawer,
    MenuDrawer,
    CanvasOverlay,
    NLayout,
    NLayoutContent,
  },
  created() {
    this.emitter.on('addToPreview', (v) => {
      let i = v.x + (store.gridXX * v.y)
      this.tempPixels[i] = v.c
    })
    this.emitter.on('clearPreview', (v) => {
      let i = v.x + (store.gridXX * v.y)
      delete this.tempPixels[i]
    })
  },
  mounted() {
    this.$refs.p5vue.loading()
    this.p5 = this.$refs.p5vue.p5
    for(let y = 0; y < store.gridXX / store.ss; y++) {
      for(let x = 0; x < store.gridXX / store.ss; x++) {
        this.gridSections.push(new GridSection(this.p5, x, y, store.ss, store.s, store.gridXX))
      }
    }
    this.HTTP
      .get('pixels')
      .then(response => {
        for (const key in response.data) {
          if(key < 1000000 && key >= 0) {
            this.placePixelInSection(key, response.data[key])
          }
        }
        for(let i = 0; i < this.gridSections.length; i++) {
          // const x = i % g
          // const y = Math.floor(i / g);
          // if(bb.l <= x && bb.r >= x && bb.t <= y && bb.b >= y) {
            // if(i == 1)
            this.gridSections[i].draw()
          // }
        }
        this.$refs.p5vue.finishedLoading()
      })

    window.Echo.channel("pixel-change").listen('PixelEvent', (e) => {
      let x = parseInt(e.x);
      let y = parseInt(e.y);
      let i = x + (store.gridXX * y)

      this.drawPixel(x, y, e.color)
      if(this.tempPixels[i] != undefined) {
        delete this.tempPixels[i]
      }
    })
  },
  data () {
    return {
      p5: null,
      store,
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
      }
    }
  },
  methods: {
    changeColor(c) {
      store.selectedColor = c
    },
    setup(p5) {
      // p5.rectMode(p5.CENTER);
      this.c = p5.color('#ffffff')
      this.canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
      p5.noSmooth()
      p5.resizeCanvas(p5.windowWidth,p5.windowHeight)
      this.center.x = p5.windowWidth / 2;
      this.center.y = (p5.windowHeight) / 2;

      let sgs = store.s * this.lg.size / 2
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
        p5.line(this.lg.x.min + (x * store.s), move + this.lg.y.min, this.lg.x.min + (x * store.s), move + this.lg.y.max);
      }
      for(let y = 0; y < this.lg.size + 1;y++) {
        let move =  p5.sin(this.lg.a + (y * this.lg.delay)) * this.lg.amp
        p5.line(move + this.lg.x.min,this.lg.y.min + + (y * store.s), move + this.lg.x.max, this.lg.y.min + (y * store.s));
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

      // draw grid
      p5.background(0);
      p5.rect(0, 0, 1000, 1000);

      for(let i = 0; i < this.gridSections.length; i++) {
          this.gridSections[i].updatePosition()
      }

      if(this.update.preview) {
        // draw  temp pixels
        for (const key in this.tempPixels) {
          if (Object.hasOwnProperty.call(this.tempPixels, key)) {
            const color = this.tempPixels[key];

            const x = key % store.gridXX;
            const y = Math.floor(key / store.gridXX);

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
      let tileX = Math.floor(ratioX / store.ss / this.sf)
      let tileY = Math.floor(ratioY / store.ss / this.sf)

      
      if(tileX < 0 || tileX > store.tileSize || tileY < 0 || tileY > store.tileSize) {
        return;
      } else {
        //let i = tileX + (10 * tileY)
        //this.gridSections[i].drawPreviewPixel(gridX, gridY, p5.color(store.selectedColor))
        this.c = p5.color(store.selectedColor)
        this.drawHoverPixel(p5, gridX, gridY, this.c)

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
      //console.log(dragVector.x, ogVector.x, dragVector.dist(ogVector))
      if(dragVector.dist(ogVector) < 5) {
        if(store.token == '') {
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

        if(gridX < 0 || gridX > store.screen.x || gridY < 0 || gridY > store.screen.y) {
          return;
        } else {
          this.c = p5.color(store.selectedColor)
          store.colorSelected()
          this.pp(gridX, gridY)
        }
      }
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
      const x = key % store.gridXX
      const y = Math.floor(key / store.gridXX)
      const xSec = Math.floor(x / store.ss)
      const ySec = Math.floor(y / store.ss)
      let i = xSec + ((store.gridXX / store.ss) * ySec)
      this.gridSections[i].setPixel(key, color)
    },
    drawPixel(x, y, c) {
      const xSec = Math.floor(x / store.ss)
      const ySec = Math.floor(y / store.ss)
      let i = xSec + (store.tileSize * ySec)
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
      this.pp(x,y)
    },
    pp(x, y) {
      let c = this.rgbToHex(this.c.levels)
      this.tempPixels[x + (store.gridXX * y)] = c;
      const bodyFormData = new FormData()
      bodyFormData.append('x', x)
      bodyFormData.append('y', y)
      bodyFormData.append('color', c)
      this.HTTP
        .post('pixels/add', bodyFormData, { headers: {"Authorization" : 'Bearer ' + store.token} })
        .then(response => {
          console.log(response)
        })
    },
    rgbToHex(c) {
      return "#" + this.componentToHex(c[0]) + this.componentToHex(c[1]) + this.componentToHex(c[2])
    },
    componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    openScript() {

    },
    startScript() {
      this.$refs.scriptPlayer.startScript();
    },
  },
  computed: {
    hasToken() {
      return store.token != ''
    },
    boundingBox() {
      const offX = -this.screenOffset.x / this.sf
      const offY = -this.screenOffset.y / this.sf
      const offDiffX = (this.center.x*2 - this.screenOffset.x) / this.sf
      const offDiffY = (this.center.y*2 - this.screenOffset.y) / this.sf
      return {
        l: Math.max(Math.floor(offX / store.s / store.ss) - 1, 0),
        r: Math.min(Math.floor(offDiffX / store.s / store.ss) + 1, 10),
        t: Math.max(Math.floor(offY / store.s/ store.ss) - 1, 0),
        b: Math.min(Math.floor(offDiffY / store.s/ store.ss) + 1, 10)
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