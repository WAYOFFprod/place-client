<template>
  <n-space vertical :size="3">
    <n-progress
      class="script-progress"
      type="line"
      :percentage="percentage"
      :show-indicator="false"
      border-radius="0"
      fill-border-radius="0"
    >
    </n-progress>
    <n-button class="script-button" type="primary" @click="toggleButton">
      {{percentage}}%
      <n-icon>
        <Play16Regular />
      </n-icon>
    </n-button>
  </n-space>
</template>

<script>
import { store } from './../store.js'
import { NProgress, NIcon, NButton, NSpace} from 'naive-ui'
import Play16Regular from '@vicons/fluent/Play16Regular'

export default {
  components: {
    Play16Regular,
    NProgress,
    NIcon,
    NButton,
    NSpace,
  },
  data () {
    return {
      store,
      seconds: 0,
      percentage: 0, 
      isPaused: true,
      isStarted: false,
      colors: [],
      sp: {
        x: 0,
        y: 0
      },
      pixels: []
    }
  },
  created() {
    this.emitter.on('preview', () => {
      this.preview()
    })
    this.emitter.on('clear', () => {
      this.clear()
    })
  },
  mounted() {
    console.log("ssss mounted")
    this.clear()
  },
  methods: {
    toggleButton() {
      if(this.isPaused) {
        this.isPaused =  false
        this.startScript()
      } else {
        this.isPaused = true
      }
    },
    setup() {
      this.colors = []
      for (let i = 0; i < store.selectedColorList.length; i++) {
        const element = store.selectedColorList[i]
        this.colors.push(element.color)
      }
      this.sp.x = store.start.x
      this.sp.y = store.start.y

      this.pixels = JSON.parse("["+store.pixelArray+"]");
    },
    preview() {
      this.setup()
      let size = this.pixels.length * this.pixels[0].length
      let count = 0
      for(let y = 0; y < this.pixels.length; y++) {
        for(let x = 0; x < this.pixels[y].length; x++) {
          count++
          this.percentage = Math.round((count / size) * 100)
          const c = this.colors[this.pixels[y][x]] // get hex string
          this.emitter.emit('addToPreview', {x: this.sp.x + x, y: this.sp.y + y, c: c})
        }
      }
      this.isPaused = true;
      this.isStarted = false
    },
    clear() {
      this.setup()
      let size = this.pixels.length * this.pixels[0].length
      let count = 0
      for(let y = 0; y < this.pixels.length; y++) {
        for(let x = 0; x < this.pixels[y].length; x++) {
          count++
          this.percentage = Math.round((count / size) * 100)
          const c = this.colors[this.pixels[y][x]] // get hex string
          this.emitter.emit('clearPreview', {x: this.sp.x + x, y: this.sp.y + y, c: c})
        }
      }
      this.isPaused = true;
      this.isStarted = false
    },
    async startScript() {
      if(this.isStarted) return
      this.isStarted = true
      
      this.setup()
      
      let size = this.pixels.length * this.pixels[0].length
      let count = 0
      for(let y = 0; y < this.pixels.length; y++) {
        for(let x = 0; x < this.pixels[y].length; x++) {
          count++
          while(this.isPaused) {
            await this.sleep(1000);
          }
          this.percentage = Math.round((count / size) * 100)
          const c = this.colors[this.pixels[y][x]] // get hex string
          this.$emit('spp', this.sp.x + x, this.sp.y + y, c)
          await this.sleep(1000);
        }
      }
      this.isPaused = true;
      this.isStarted = false
    },
    sleep(milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    },
  }
}
</script>

<style>
.overlay {
  position: static;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.script-button {
  width: 80px;
  margin-bottom: 0px;
}
.script-progress {
  min-width: 80px;
}
</style>