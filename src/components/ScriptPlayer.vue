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
import {useDialog} from 'naive-ui'

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
      pixels: [],
      dialog: useDialog(),
      dialogViewed: false,
    }
  },
  created() {
    store.loadScriptData()
    this.emitter.on('preview', () => {
      this.preview()
    })
    this.emitter.on('clear', () => {
      this.clear()
      this.dialogViewed = false
    })
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

      this.parseJson("["+store.pixelArray+"]")
      let ok = this.validate()
      if(ok) {
        store.saveScriptData()
      }
      return ok
    },
    validate() {
      let isValid = true
      isValid = this.checkCoords()
      return isValid
    },
    checkCoords() {
      if(!this.dialogViewed) {
        this.dialogViewed = true
        if(this.sp.x < 0 || this.sp.y < 0) {
          this.dialog.error({
            title: 'X or Y coordinate are negative.',
            content: 'Can\'t have that!',
            positiveText: 'Ok!',
            onPositiveClick: () => {
              store.isScriptDrawerOpen = true
            }
          })
          return false
        }
        if(this.sp.x + this.pixels[0].length > 100000 || this.sp.y + this.pixels.length > 1000000) {
          this.dialog.error({
            title: 'Your drawing goes too far.',
            content: 'Can\'t have that!',
            positiveText: 'Ok!',
            onPositiveClick: () => {
              store.isScriptDrawerOpen = true
            }
          })
          return false
        }
      }
      return true
    },
    parseJson(str) {
      try {
        this.pixels = JSON.parse(str);
      } catch (e) {
        console.log(e);
        if(!this.dialogViewed) {
          this.dialogViewed = true
          this.dialog.error({
            title: 'there seem to be an issue with the arrays',
            content: 'Make sure you didn\'t forget anything',
            positiveText: 'Ok!',
            onPositiveClick: () => {
              store.isScriptDrawerOpen = true
            }
          })
        }
        return false;
      }
      return true;
    },
    preview() {
      this.setup()
      for(let y = 0; y < this.pixels.length; y++) {
        if(y < store.offset.y) continue
        for(let x = 0; x < this.pixels[y].length; x++) {
          if(x < store.offset.x && y == store.offset.y) continue
          const c = this.colors[this.pixels[y][x]] // get hex string
          this.emitter.emit('addToPreview', {x: this.sp.x + x, y: this.sp.y + y, c: c})
        }
      }
      this.isStarted = false
    },
    clear() {
      this.setup()
      for(let y = 0; y < this.pixels.length; y++) {
        if(y < store.offset.y) continue
        for(let x = 0; x < this.pixels[y].length; x++) {
          if(x < store.offset.x && y == store.offset.y) continue
          const c = this.colors[this.pixels[y][x]] // get hex string
          this.emitter.emit('clearPreview', {x: this.sp.x + x, y: this.sp.y + y, c: c})
        }
      }
      this.percentage = 0
      this.isPaused = true
      this.isStarted = false
    },
    async startScript() {
      if(this.isStarted) return
      this.isStarted = true
      
      let isvalid = this.setup()
      if(!isvalid) return
      
      let size = this.pixels.length * this.pixels[0].length - (store.offset.x + store.offset.y + (store.offset.x * store.offset.y))
      let count = 0
      for(let y = 0; y < this.pixels.length; y++) {
        if(y < store.offset.y) continue
        for(let x = 0; x < this.pixels[y].length; x++) {
          if(!this.isStarted) return // stop function
          if(x < store.offset.x && y == store.offset.y) continue
          count++
          while(this.isPaused) {
            await this.sleep(1000);
            if(!this.isStarted) return // stop function
          }
          store.offset.x = x
          store.offset.y = y
          
          this.percentage = Math.round((count / size) * 100)
          const c = this.colors[this.pixels[y][x]] // get hex string
          this.$emit('spp', this.sp.x + x, this.sp.y + y, c)
          await this.sleep(1000);
        }
      }
      this.isPaused = true;
      this.isStarted = false
      store.offset.x = 0
      store.offset.y = 0
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