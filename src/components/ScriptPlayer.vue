<template>
  <n-space vertical :size="3">
    <n-button class="script-button" type="primary" @click="toggleButton">
      {{scriptStore.percentage}}%
      <n-icon>
        <play16-regular />
      </n-icon>
    </n-button>
    <n-progress
      class="script-progress"
      type="line"
      :percentage="scriptStore.percentage"
      :show-indicator="false"
      border-radius="0"
      fill-border-radius="0"
    >
    </n-progress>
  </n-space>
</template>

<script>
import { canvasStore, scriptStore, arraySS, copySS } from './../store.js'
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
      canvasStore,
      scriptStore,
      arraySS,
      copySS,
      seconds: 0,
    }
  },
  created() {
    this.emitter.on('saveCopy', () => {
      this.copyContent()
    })
  },
  unmounted() {
    scriptStore.isStarted = false
    scriptStore.isPaused = true
  },
  methods: {
    toggleButton() {
      if(scriptStore.isPaused) {
        scriptStore.isPaused =  false
        this.startScript()
      } else {
        scriptStore.isPaused = true
      }
    },
    startScript() {
      if(scriptStore.isStarted) return
      scriptStore.isStarted = true

      switch (scriptStore.scriptType) {
        case 'array':
          this.drawPreview()
          break;
        case 'copy':
          this.copyContent()
          break;
        default:
          break;
      }
    },
    async copyContent() {
      this.emitter.emit("storePixel")
      scriptStore.isStarted = false

      arraySS.selectedColorList = []
      arraySS.pixelArray = ""
      for(let y = 0; y < copySS.pixelArray.length; y++) {
        arraySS.pixelArray += "["
        for (let x = 0; x < copySS.pixelArray[y].length; x++) {
          let c = copySS.pixelArray[y][x]
          let colorIndex = undefined
          if(c == false) {
            colorIndex = -1
          }
          
          let existingColor = arraySS.selectedColorList.filter(e => e.color === c)
          console.log(existingColor)
          if(existingColor.length > 0){
            colorIndex = existingColor[0].id
          }

          if(colorIndex === undefined) {
            colorIndex = arraySS.selectedColorList.length
            arraySS.selectedColorList.push({
              id: colorIndex,
              color: c
            })
          }
          
          arraySS.pixelArray += colorIndex
          if(x < copySS.pixelArray[y].length - 1) {
            arraySS.pixelArray += ","
          }
        }
        arraySS.pixelArray += "]"
        if(y < copySS.pixelArray.length - 1) {
          arraySS.pixelArray += ",\n"
        }
      }
      console.log(arraySS.pixelArray)
      // save starting bound as offset
      arraySS.start.x = copySS.bound.start.x
      arraySS.start.y = copySS.bound.start.y
    },
    async drawPreview() {
      if(!arraySS.pixels) return
      let size = arraySS.pixels.length * arraySS.pixels[0].length - (arraySS.offset.x + arraySS.offset.y + (arraySS.offset.x * arraySS.offset.y))
      let count = 0
      for(let y = 0; y < arraySS.pixels.length; y++) {
        if(y < arraySS.offset.y) continue
        for(let x = 0; x < arraySS.pixels[y].length; x++) {
          if(!scriptStore.isStarted) return // stop function
          if(x < arraySS.offset.x && y == arraySS.offset.y) continue
          if(arraySS.pixels[y][x] < 0) continue
          count++
          while(scriptStore.isPaused) {
            await this.sleep(1000);
            if(!scriptStore.isStarted) return // stop function
          }
          arraySS.offset.x = x
          arraySS.offset.y = y
          
          scriptStore.percentage = Math.round((count / size) * 100)
          const c = arraySS.colors[arraySS.pixels[y][x]] // get hex string
          const data = {
            x: arraySS.sp.x + x,
            y: arraySS.sp.y + y,
            c: c
          }
          this.emitter.emit("placePixel", data)
          await this.sleep(1000);
        }
      }
      scriptStore.isPaused = true;
      scriptStore.isStarted = false
      arraySS.offset.x = 0
      arraySS.offset.y = 0
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