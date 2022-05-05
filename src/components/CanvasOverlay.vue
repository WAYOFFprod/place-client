<template>
  <div class="static-container">
    <n-space :size="24" align="center" v-if="sessionStore.isFinishedConnecting">
      <n-space vertical :size="3">
        <div class="gap" />
        <n-color-picker
            class="color-picker"
            :show-alpha="false"
            :swatches="scriptStore.swatches"
            v-model:value="scriptStore.selectedColor"
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
      <ScriptPlayer 
        ref="scriptPlayer"
        @spp="spp"
      />
      <n-space vertical :size="3">
        <div class="gap" />
        <n-button type="primary" @click="toggleMode()">
          {{mode}}
        </n-button>
      </n-space>
    </n-space>
  </div>
</template>

<script>
import { sessionStore, UIStore, scriptStore } from './../store.js'
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
      scriptStore,
      UIStore,
      pixelViewerMode: false,
    }
  },
  methods: {
    spp(x,y,c) {
      this.$emit("spp" ,x ,y, c)
    },
    toggleMode() {
      this.pixelViewerMode = !this.pixelViewerMode
    }
  },
  computed: {
    buttonLabel() {
      if(sessionStore.isLoggedIn) {
        return "COLORS"
      } else {
        return "LOGIN/REGISTER"
      }
    },
    mode() {
      if(this.pixelViewerMode) {
        return "Pixel Viewer"
      } else {
        return "Pixel Placer"
      }
    }
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