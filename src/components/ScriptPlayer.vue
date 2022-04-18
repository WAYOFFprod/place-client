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
  </n-space>
  <n-button class="script-button" type="primary" @click="toggleButton">
    {{percentage}}%
    <n-icon>
      <Play16Regular />
    </n-icon>
  </n-button>
</template>

<script>
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
      seconds: 0,
      percentage: 0, 
      isPaused: true,
      isStarted: false,
    }
  },
  mounted() {
    console.log("script mounted")
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
    async startScript() {
      if(this.isStarted) return
      this.isStarted = true

      let colors = [
        "#0f0fff",
        "#00f000"
      ]
      let sp = {
        x: 10,
        y: 10,
      }
      let pixels = [
        [0,0,0,0,0],
        [0,0,1,0,0],
        [0,1,1,1,0],
        [0,0,1,0,0],
        [0,0,0,0,0]
      ]
      let size = pixels.length * pixels[0].length
      let count = 0
      for(let y = 0; y < pixels.length; y++) {
        for(let x = 0; x < pixels[y].length; x++) {
          count++
          while(this.isPaused) {
            await this.sleep(1000);
          }
          await this.sleep(1000);
          this.percentage = Math.round((count / size) * 100)
          const c = colors[pixels[y][x]] // get hex string
          console.log(sp, y, x, c)
          this.$emit('spp', sp.x + x, sp.y + y, c)
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