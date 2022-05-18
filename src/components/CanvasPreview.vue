<template>
  <div
    v-if="canvas == null"
    class="placeholder"
  />
  <div
    :id="getId"
    class="canvas-preview"
    @click="loadImage"
  />
</template>

<script>
import P5 from 'p5'
import VueAxios from './common/http-common'

export default {
  mixins: [VueAxios],
  components: {
  },
  props: [
    'canvasId',
    'width',
    'height',
  ],
  data() {
    return {
      p5: null,
      image: null,
      canvas: null,
      w: 0,
    }
  },
 async mounted() {
    await this.waitfor(500);
    const t = this;
      const script = function (p5) {
        t.p5 = p5;
        t.image = p5.createImage(t.width, t.height)
        // NOTE: Set up is here   
        p5.setup = () => {     
          t.init()
        }     
        // NOTE: Draw is here
        p5.draw = () => { 
          
        }
      }
      // NOTE: Use p5 as an instance mode
      new P5(script, "p5-preview"+this.canvasId)
  },
  methods: {
    init() {
      this.w = this.$parent.$el.clientWidth
      this.canvas = this.p5.createCanvas(this.w, this.w);
      this.p5.background(255);
      let center = this.w / 2
      this.p5.textAlign(this.p5.CENTER);
      this.p5.text('Click to load preview', center, center)
    },
    loadImage() {
      this.HTTP
        .get('pixels/'+this.canvasId)
        .then(response => {
          if(response.data) {
            this.createImage(response.data)
          }
        })
    },
    createImage(data) {
      this.image.loadPixels()
      for (const key in data) {
        if(key < this.width * this.height && key >= 0) {
          const x =  key % this.width
          const y =  Math.floor(key / this.width)
          const color = data[key]
          this.image.set(x, y, [this.p5.red(color), this.p5.green(color), this.p5.blue(color), 255]);
        }
      }
      this.image.updatePixels();
      this.image.resize(this.w, 0)
      this.p5.background(255);
      this.p5.image(this.image, 0, 0)
    },
    waitfor(s) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
        }, s);
      });
    },
  },
  computed: {
    getId() {
      return "p5-preview"+this.canvasId
    }
  }
}
</script>

<style>
.canvas-preview {
  width: 100%;
  height: 100%;
}
.placeholder {
  width: 100%;
  height: 0;
  padding-top: 100%;
}
</style>