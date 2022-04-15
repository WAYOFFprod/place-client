<template>
  <div id="game-container" class="center">
    <div class="center-container">
      <VueP5 ref="p5vue"
        class="center-block"
        @setup="setup" 
        @draw="draw"
        @loading="drawLoading"
        @mousePressed="mousePressed"
        @mouseReleased="mouseReleased"
        @keyReleased="keyReleased"
        @scroll="scroll"
      />
      <div class="center-block scroll-container">
        <ColorSelector class="swatch-container" @selectedColor="changeColor" />
      </div>
      <Login 
        ref="loginModal"
      />
      <VueAxios ref="axios" />
    </div>
  </div>
</template>

<script>
import VueP5 from './VueP5.vue';
import ColorSelector from './ColorSelector.vue';
//mport VueAxios from './VueAxios.vue'
import { store } from './../store.js'
import Login from './Login.vue';
import VueAxios from './common/http-common';
//import axios from 'axios';

export default {
  name: "game",
  mixins: [VueAxios],
  components: {
    VueP5,
    ColorSelector,
    VueAxios,
    Login
  },
  mounted() {
    this.$refs.loginModal.toggleShowModal()
    this.$refs.p5vue.loading()
    this.HTTP
      .get('pixels')
      .then(response => {
        this.pixels = response.data
        this.$refs.p5vue.finishedLoading()
      })

    window.Echo.channel("pixel-change").listen('PixelEvent', (e) => {
      this.pixels[parseInt(e.x) + (this.gridXX * parseInt(e.y))] = e.color;
      //this.drawPixel(p5, e.x * this.s, + e.y * this.s, e.color)
    })
  },
  data () {
    return {
      grab: {
        x: 0,
        y: 0,
        offX: 0,
        offY: 0
      },
      pixels: [],
      speed: 2,
      screen: {
        x: 1000 * 20,
        y: 1000 * 20
      },
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
      s: 20,
      c: null,
      hexC: "#ffffff",
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
      }
    }
  },
  methods: {
    changeColor(c) {
      this.hexC = c
    },
    setup(p5) {
      // p5.rectMode(p5.CENTER);
      this.c = p5.color('#ffffff')
      
      this.canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
      p5.resizeCanvas(p5.windowWidth,p5.windowHeight - 100)
      this.center.x = p5.windowWidth / 2;
      this.center.y = (p5.windowHeight - 100) / 2;

      let sgs = this.s * this.lg.size / 2
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
        p5.line(this.lg.x.min + (x * this.s), move + this.lg.y.min, this.lg.x.min + (x * this.s), move + this.lg.y.max);
      }
      for(let y = 0; y < this.lg.size + 1;y++) {
        let move =  p5.sin(this.lg.a + (y * this.lg.delay)) * this.lg.amp
        p5.line(move + this.lg.x.min,this.lg.y.min + + (y * this.s), move + this.lg.x.max, this.lg.y.min + (y * this.s));
      }
      this.lg.a += p5.TWO_PI / s

      p5.textSize(24);
      p5.text('loading', this.center.x - 38, this.center.y + 80);
    },
    draw (p5) {
      //drag canvas
      if(this.mouseDown) {
        // store the offset and divide by the scale factor to keep constant speed while dragging 
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
      p5.fill(255)
      p5.rect(0, 0, this.screen.x, this.screen.y);

      p5.stroke(220)
      p5.strokeWeight(1)
      for(let x = 0; x < this.screen.x / this.s ;x++) {
        p5.line(x * this.s, 0, x * this.s, this.screen.y);
      }
      for(let y = 0; y < this.screen.y / this.s ;y++) {
        p5.line(0, y * this.s, this.screen.y, y * this.s);
      }
      const bb = this.boundingBox
      // draw points
      for (const key in this.pixels) {
        if (Object.hasOwnProperty.call(this.pixels, key)) {
          const element = this.pixels[key];

          const x = key % this.gridXX;
          const y = Math.floor(key / this.gridXX);

          // only render if in bounding box
          if(bb.l < x && bb.r > x && bb.t < y && bb.b > y) {
            this.drawPixel(p5, x * this.s, + y * this.s, element)
          }
        }
      }
    },
    mousePressed (p5) {
      // when mouse pressed
      // store the position of the initial grab and multiply the offset by the scale factore (to noralize?)
      this.grab.x = p5.mouseX - (this.screenOff.x * this.sf)
      this.grab.y = p5.mouseY - (this.screenOff.y * this.sf)
      this.screenMove.x = p5.mouseX;
      this.screenMove.y = p5.mouseY;
      this.mouseDown = true
    },
    mouseReleased (p5) {
      this.mouseDown = false;
      let dragVector = p5.createVector(this.screenMove.x, this.screenMove.y);
      let ogVector = p5.createVector(p5.mouseX, p5.mouseY)
      //console.log(dragVector.x, ogVector.x, dragVector.dist(ogVector))
      if(dragVector.dist(ogVector) < 5) {

        let ratioX = (p5.mouseX - this.screenOffset.x)/ this.sf
        let ratioY = (p5.mouseY - this.screenOffset.y)/ this.sf

        let gridX = (ratioX - (ratioX % this.s))
        let gridY = (ratioY - (ratioY % this.s))
        if(gridX < 0 || gridX > this.screen.x || gridY < 0 || gridY > this.screen.y) {
          return;
        } else {
          this.c = p5.color(this.hexC)
          this.placePixel(gridX, gridY)
        }
      }
    },
    scroll(e) {
      if (e.deltaY > 0) {
        this.sf *= 1.05;
      } else {
        this.sf *= 0.95;
      }
    },
    drawPixel(p5, x,y, c) {
      p5.strokeWeight(0)
      p5.fill(c)
      p5.square(x, y, this.s)
    },
    placePixel(x, y) {
      const bodyFormData = new FormData()
      bodyFormData.append('x', x / this.s)
      bodyFormData.append('y', y / this.s)
      bodyFormData.append('color', this.rgbToHex(this.c.levels))
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
    }
  },
  computed: {
    gridXX () {
      return this.screen.x / this.s
    } ,
    gridYY () {
      return this.screen.y / this.s
    },
    boundingBox() {
      const offX = -this.screenOffset.x / this.sf
      const offY = -this.screenOffset.y / this.sf
      const offDiffX = (this.center.x*2 - this.screenOffset.x) / this.sf
      const offDiffY = (this.center.y*2 - this.screenOffset.y) / this.sf
      return {
        l: (offX / this.s) - 1,
        r: (offDiffX / this.s) + 1,
        t: (offY / this.s) - 1,
        b: (offDiffY / this.s) + 1,
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
body {
  margin: 0;
}
</style>