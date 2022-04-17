<template>
  <n-progress type="circle" :percentage="percentage" >
    <n-button type="primary" @click="toggleButton">
      {{percentage}}%
      <n-icon>
        <Play16Regular />
      </n-icon>
    </n-button>
  </n-progress>
</template>

<script>
import { NProgress, NIcon, NButton} from 'naive-ui'
import Play16Regular from '@vicons/fluent/Play16Regular'

export default {
  components: {
    Play16Regular,
    NProgress,
    NIcon,
    NButton,
  },
  data () {
    return {
      percentage: 0, 
      isPaused: false,
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
    pauseScript() {

    },
    sleep(milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    },
  },
  // watch: {
  //   // whenever question changes, this function will run
  //   store.(newQuestion, oldQuestion) {
  //     if (newQuestion.indexOf('?') > -1) {
  //       this.getAnswer()
  //     }
  //   }
  // },
}
</script>

<style>

</style>