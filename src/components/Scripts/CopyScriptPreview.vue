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
import { copySS, previewStore } from './../../store.js'
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
      previewStore,
      p5: null,
      canvas: null,
      img: null,
      canvasName: 'preview-canvas',
      canvasClass: "preview-canvas",
      size: 500,
    }
  },
  methods: {
    setup(p5) {
      this.p5 = p5
      this.canvas = p5.createCanvas(this.size, this.size);
      this.canvas.class(this.canvasClass)
      p5.noSmooth()
      p5.resizeCanvas(this.size, this.size)
      this.img = p5.createImage(this.size, this.size)
      this.$refs.p5vue.finishedLoading()
    },
    draw(p5) {
      if(previewStore.pixelArray.length > 0) {
        const h = previewStore.pixelArray.length
        const w = previewStore.pixelArray[0].length
        const l = h < w ? w : h
        p5.scale(this.size / l)
        p5.background(0)
        p5.rect(0, 0, w, h)

        // draw  temp pixels
        this.img = p5.createImage(this.size, this.size)
        this.img.loadPixels();
        for (let y = 0; y <previewStore.pixelArray.length; y++) {
          for (let x = 0; x < previewStore.pixelArray[y].length; x++) {
            const color = previewStore.pixelArray[y][x]
            if(color) {
              this.img.set(x, y, [this.p5.red(color), this.p5.green(color), this.p5.blue(color), 255]);
            } else {
              this.img.set(x, y, [255, 255, 255, 255]);
            }
          }
        }
        this.img.updatePixels();
        this.p5.image(this.img, 0, 0)
      }
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