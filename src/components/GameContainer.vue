<template>
  <div id="game-container" class="center">
    <div class="center-container">
      <VueP5 ref="p5vue"
        class="center-block"
        @setup="setup" 
        @draw="draw"
        @mousePressed="mousePressed"
        @mouseReleased="mouseReleased"
        @keyReleased="keyReleased"
        @something="something"
        @scroll="scroll"
      />
      <ColorSelector class="center-block" @selectedColor="changeColor" />
    </div>
  </div>
</template>

<script>
import VueP5 from './VueP5.vue';
import ColorSelector from './ColorSelector.vue';
import { HTTP } from './common/http-common';
import axios from 'axios';

export default {
  name: "game",
  components: {
    VueP5,
    ColorSelector
  },
  mounted() {
    HTTP
      .get('pixels')
      .then(response => {
        this.pixels = response.data;
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
      posX: 0,
      screen: {
        x: 1000 * 20,
        y: 1000 * 20
      },
      s: 20,
      c: null,
      hexC: "#ffffff",
      echo: null,
      sf: 1,
      oldSf: 1,
      mouseDown: false,
      screenOff: {
        x: 0,
        y: 0
      },
      screenMove: {
        x: 0,
        y: 0
      },
      center: {
        x: 0,
        y: 0
      }
    }
  },
  methods: {
    changeColor(c) {
      this.hexC = c
    },
    something(p5) {
      this.c = p5.color(this.hexC)
      p5.fill(this.c)
      p5.square(0, 0, this.s)
    },
    setup(p5) {
      // p5.rectMode(p5.CENTER);
      this.c = p5.color('#ffffff')
      
      this.canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
      p5.resizeCanvas(p5.windowWidth,p5.windowHeight - 100)
      this.center.x = p5.windowWidth / 2;
      this.center.y = (p5.windowHeight - 100) / 2;
    },
    draw (p5) {
      //drag canvas
      if(this.mouseDown) {
        this.screenOff.x = (p5.mouseX - this.grab.x)  / this.sf
        this.screenOff.y = (p5.mouseY - this.grab.y) / this.sf
      }
      let sfChange = this.sf - this.oldSf
      let tx = this.screenOff.x
      let ty = this.screenOff.y
      let offCenterX = tx - ((-tx + this.center.x) * sfChange)
      let offCenterY = ty - ((-ty + this.center.y) * sfChange)
      p5.translate(offCenterX, offCenterY)
      p5.scale(this.sf);

      // draw grid
      p5.background(0);
      p5.fill(255)
      p5.rect(0, 0, this.screen.x, this.screen.y);

      p5.stroke(220)
      p5.strokeWeight(1)
      for(var x = 0; x < this.screen.x / this.s ;x++) {
        p5.line(x * this.s, 0, x * this.s, this.screen.y);
      }
      for(var y = 0; y < this.screen.y / this.s ;y++) {
        p5.line(0, y * this.s, this.screen.y, y * this.s);
      }

      // draw points
      for (const key in this.pixels) {
        if (Object.hasOwnProperty.call(this.pixels, key)) {
          const element = this.pixels[key];

          const x = key % this.gridXX;
          const y = Math.floor(key / this.gridXX);

          this.drawPixel(p5, x * this.s, + y * this.s, element)
        }
      }
    },
    mousePressed (p5) {
      this.grab.x = p5.mouseX - this.screenOff.x * this.sf
      this.grab.y = p5.mouseY - this.screenOff.y * this.sf
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
        let ratioX = (p5.mouseX - this.screenOff.x) / this.sf
        let ratioY = (p5.mouseY - this.screenOff.y) / this.sf
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
        this.sf *= 1.04;
      } else {
        this.sf *= 0.96;
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
      axios({
        method: "post",
        url: "http://"+process.env.VUE_APP_WEBSOCKET_SERVER+":8001/api/pixels/add",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
    },
    rgbToHex(c) {
      return "#" + this.componentToHex(c[0]) + this.componentToHex(c[1]) + this.componentToHex(c[2])
    },
    componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
  },
  computed: {
    gridXX () {
      return this.screen.x / this.s
    } ,
    gridYY () {
      return this.screen.y / this.s
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
  flex-wrap: wrap;
}
body {
  margin: 0;
}
</style>