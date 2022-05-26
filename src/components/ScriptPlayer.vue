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
import { canvasStore, scriptStore, arraySS, copySS, previewStore } from './../store.js'
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
      previewStore,
      seconds: 0,
    }
  },
  created() {
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
          break;
        default:
          break;
      }
    },
    async drawPreview() {
      if(!previewStore.pixelArray) return
      let size = previewStore.pixelArray.length * previewStore.pixelArray[0].length - (arraySS.offset.x + arraySS.offset.y + (arraySS.offset.x * arraySS.offset.y))
      let count = 0
      for(let y = 0; y < previewStore.pixelArray.length; y++) {
        if(y < arraySS.offset.y) continue
        for(let x = 0; x < previewStore.pixelArray[y].length; x++) {
          if(!scriptStore.isStarted) return // stop function
          if(x < arraySS.offset.x && y == arraySS.offset.y) continue
          if(previewStore.pixelArray[y][x] < 0) continue
          count++
          while(scriptStore.isPaused) {
            await this.sleep(1000);
            if(!scriptStore.isStarted) return // stop function
          }
          arraySS.offset.x = x
          arraySS.offset.y = y
          
          scriptStore.percentage = Math.round((count / size) * 100)
          const c = arraySS.colors[previewStore.pixelArray[y][x]] // get hex string
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