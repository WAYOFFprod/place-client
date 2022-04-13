<template>
  <div id="game-container" class="center">
    <div class="center-container">
      <VueP5 ref="p5vue" 
        class="center-block"
        @setup="setup" 
        @draw="draw"
        @mouseClicked="mouseClicked"
        @keyReleased="keyReleased"
        @something="something"
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
    const p5 = this.$refs.p5vue.p5
    HTTP
      .get('pixels')
      .then(response => {
        //console.log(response.data)
        for (const key in response.data) {
          if (Object.hasOwnProperty.call(response.data, key)) {
            const element = response.data[key];
            
            const x = key % this.gridX;
            const y = Math.floor(key / this.gridX);

            this.drawPixel(p5, x * this.s, + y * this.s, element)
          }
        }
      })

    window.Echo.channel("pixel-change").listen('PixelEvent', (e) => {
      this.drawPixel(p5, e.x * this.s, + e.y * this.s, e.color)
    })
  },
  data () {
    return {
      speed: 2,
      posX: 0,
      screen: {
        x: 1000,
        y: 1000
      },
      s: 20,
      c: null,
      hexC: "#ffffff",
      echo: null
    }
  },
  methods: {
    changeColor(c) {
      this.hexC = c
    },
    something(p5) {
      p5.strokeWeight(0)
      this.c = p5.color(this.hexC)
      p5.fill(this.c)
      p5.square(0, 0, this.s)
    },
    setup(p5) {
      this.c = p5.color('#ffffff')
      p5.stroke(255)
      p5.strokeWeight(2)
      this.canvas = p5.createCanvas(this.screen.x, this.screen.y);
      p5.background(255);
      for(var x = 0; x < this.screen.x / this.s ;x++) {
        p5.line(x * this.s, 0, x * this.s, this.screen.y);
      }
      for(var y = 0; y < this.screen.y / this.s ;y++) {
        p5.line(0, y * this.s, this.screen.y, y * this.s);
      }  
    },
    // draw (p5) {
    // },
    mouseClicked (p5) {
      //console.log(p5);
      let gridX = -1
      let gridY = -1
      if(p5.mouseX < 0 || p5.mouseX > p5.canvasWidth || p5.mouseY < 0 || p5.mouseY > p5.canvasHeight) {
        return;
      } else {
        gridX = p5.mouseX - (p5.mouseX % this.s)
        gridY = p5.mouseY - (p5.mouseY % this.s)

        this.c = p5.color(this.hexC)
        this.drawPixel(p5, gridX, gridY, this.c)
        this.placePixel(gridX, gridY)
      }
    },
    drawPixel(p5, x,y, c) {
      //console.log(p5);
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
        url: "http://"+process.env.VUE_APP_WEBSOCKET_SERVER+"/api/pixels/add",
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
    }
  },
  computed: {
    gridX () {
      return this.screen.x / this.s
    } ,
    gridY () {
      return this.screen.y / this.s
    }
  }
}
</script>

<style>
#game-container {
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
}
.center-block {
  max-width: 500px;
  flex-wrap: wrap;
}
</style>