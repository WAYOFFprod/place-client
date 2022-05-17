<template>
  <div class="static-container">
    <n-space :size="24" align="center" v-if="sessionStore.isFinishedConnecting">
      <n-space vertical :size="3">
        <div class="gap" />
        <n-color-picker
            class="color-picker"
            :show-alpha="false"
            :swatches="canvasStore.swatches"
            v-model:value="canvasStore.selectedColor"
            :modes="['hex']"
            size="large"
          />
      </n-space>
      <n-space vertical :size="3">
        <div class="gap" />
        <n-button type="primary" @click="UIStore.toggledrawer()">
          {{ buttonLabel }}
        </n-button>
      </n-space>
      <n-space vertical :size="3">
        <div class="gap" />
        <n-button v-if="sessionStore.isLoggedIn" type="primary" @click="UIStore.toggleScriptDrawer()">
          SCRIPT
        </n-button>
      </n-space>
      <script-player 
        ref="scriptPlayer"
        @spp="spp"
      />
    </n-space>
  </div>
</template>

<script>
import { sessionStore, UIStore, canvasStore } from './../store.js'
import ScriptPlayer from './ScriptPlayer.vue'
import { NButton, NSpace, NColorPicker } from 'naive-ui'
export default {
  components: {
    ScriptPlayer,
    NButton,
    NSpace,
    NColorPicker
  },
  data () {
    return {
      sessionStore,
      canvasStore,
      UIStore,
    }
  },
  mounted() {
    canvasStore.loadData()
  },
  methods: {
    spp(x,y,c) {
      this.$emit("spp" ,x ,y, c)
    },
  },
  computed: {
    buttonLabel() {
      if(sessionStore.isLoggedIn) {
        return "COLORS"
      } else {
        return "LOGIN/REGISTER"
      }
    },
  }
}
</script>

<style>
.gap {
  height: 7px;
}
.color-picker {
  margin: 2px;
}
</style>