<template>
  <vue-p5 ref="p5vue"
    @setup="setup" 
    @draw="draw"
    :container="canvasName"
    :c="canvasClass"
  />
  <n-button @click="shiftUp">Top</n-button>
  <n-button @click="shiftLeft">Left</n-button>
  <n-button @click="shiftRight">Right</n-button>
  <n-button @click="shiftDown">Down</n-button>
</template>

<script>
import VueP5 from './../VueP5.vue'
import { copySS } from './../../store.js'
import { NButton } from 'naive-ui'

export default {
  props: [
    'width'
  ],
  components: {
    VueP5,
    NButton,
  },
  mounted() {
    this.emitter.emit('storePixel')
  },
  data () {
    return {
      copySS,
      p5: null,
      canvas: null,
      img: null,
      canvasName: 'preview-canvas',
      canvasClass: "preview-canvas"
    }
  },
  methods: {
    setup(p5) {
      this.p5 = p5
      this.canvas = p5.createCanvas(500, 500);
      this.canvas.class(this.canvasClass)
      p5.noSmooth()
      p5.resizeCanvas(500, 500)
      this.img = p5.createImage(500, 500)
      this.$refs.p5vue.finishedLoading()
    },
    draw(p5) {
      const h = copySS.pixelArray.length
      const w = copySS.pixelArray[0].length
      const l = h < w ? w : h
      p5.scale(500 / l)
      p5.background(255)
      // draw  temp pixels
      this.img.loadPixels();
      console
      for (let y = 0; y <copySS.pixelArray.length; y++) {
        for (let x = 0; x < copySS.pixelArray[y].length; x++) {
          const color = copySS.pixelArray[y][x];
          if(color) {
            this.img.set(x, y, [this.p5.red(color), this.p5.green(color), this.p5.blue(color), 255]);
          } else {
            this.img.set(x, y, [255, 255, 255, 255]);
          }
        }
      }
      this.img.updatePixels();
      this.p5.image(this.img, 0, 0)
    },
    shiftUp() {
      copySS.bound.start.y -=1
      copySS.bound.end.y -=1
      this.emitter.emit('storePixel')
    },
    shiftDown() {
      copySS.bound.start.y +=1
      copySS.bound.end.y +=1
      this.emitter.emit('storePixel')
    },
    shiftRight() {
      copySS.bound.start.x +=1
      copySS.bound.end.x +=1
      this.emitter.emit('storePixel')
    },
    shiftLeft() {
      copySS.bound.start.x -=1
      copySS.bound.end.x -=1
      this.emitter.emit('storePixel')
    }
  },
  computed: {

  }
}
</script>

<style>
.preview-canvas {
  height: 500px;
  width: 500px;
}
</style>