<template>
  <n-progress type="circle" :percentage="percentage" >
    <n-button type="primary" @click="toggleButton">
      {{percentage}}%
      <template #icon>
        <n-icon>
          <cash-icon />
        </n-icon>
      </template>
    </n-button>
  </n-progress>
</template>

<script>
import { NProgress, NIcon, NButton} from 'naive-ui'

export default {
  components: {
    NProgress,
    NIcon,
    NButton
  },
  data () {
    return {
      percentage: 0, 
      isRunning: false
    }
  },
  methods: {
    toggleButton() {
      if(this.isRunning) {
        this.startScript()
      } else {
        this.pauseScript()
      }
      this.isRunning = !this.isRunning;
    },
    async startScript() {
      let colors = [
        "#ffff00",
        "#00ffff"
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
          while(!this.isRunning) {
            await this.sleep(1000);
          }
          await this.sleep(1000);
          this.percentage = (count / size) * 100
          console.log(sp.x + x, sp.y + y)
          const c = colors[pixels[y][x]] // get hex string
          this.$emit('spp', sp.x + x, sp.y + y, c)
        }
      }
    },
    pauseScript() {

    },
    sleep(milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    },
  }
}
</script>

<style>

</style>