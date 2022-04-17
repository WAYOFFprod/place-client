<template>
 <n-el>
 <n-progress
        type="multiple-circle"
        :stroke-width="6"
        :circle-gap="0.5"
        :percentage="[
          percentage,
          seconds
        ]"
        :color="[
          'var(--info-color)',
          'var(--success-color)',
        ]"
        :rail-style="[
          { stroke: 'var(--info-color)', opacity: 0.3 },
          { stroke: 'var(--success-color)', opacity: 0.3 },
        ]"
      >
    <!-- <n-progress type="circle" :percentage="percentage" > -->

    <n-button type="primary" @click="toggleButton">
      {{percentage}}%
      <n-icon>
        <Play16Regular />
      </n-icon>
    </n-button>
  </n-progress>
 </n-el>
</template>

<script>
import { NProgress, NIcon, NButton, NEl} from 'naive-ui'
import Play16Regular from '@vicons/fluent/Play16Regular'

export default {
  components: {
    Play16Regular,
    NProgress,
    NIcon,
    NButton,
    NEl,
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
        this.startScript()
      } else {
        this.pauseScript()
      }
      this.isPaused = !this.isPaused;
    },
    async startScript() {
      if(this.isStarted) return
      this.isStarted = true

      let colors = [
        "#0fff00",
        "#f000ff"
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
          this.percentage = (count / size) * 100
          const c = colors[pixels[y][x]] // get hex string
          console.log(sp, y, x, c)
          this.$emit('spp', sp.x + x, sp.y + y, c)
        }
      }
      this.isStarted = false
    },
    async count() {
      let lastUpdate;
      while(this.isPaused) {
        let now = Date.now();
        let dt = now - lastUpdate;
        lastUpdate = now;
        this.seconds = this.seconds + (dt /1000)
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