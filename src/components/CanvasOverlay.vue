<template>
  <div class="static-container">
    <n-space :size="24" align="center" v-if="store.isFinishedConnecting">
      <n-space vertical :size="3">
        <div class="gap" />
        <n-color-picker
            class="color-picker"
            :show-alpha="false"
            v-model:value="store.selectedColor"
            :swatches="store.swatches"
            :modes="['hex']"
            size="large"
          />
      </n-space>
      <n-space vertical :size="3">
        <div class="gap" />
        <n-button type="primary" @click="store.toggledrawer()">
          {{ buttonLabel }}
        </n-button>
      </n-space>
      <n-space vertical :size="3">
        <div class="gap" />
        <n-button v-if="store.isLoggedIn" type="primary" @click="store.toggleScriptDrawer()">
          SCRIPT
        </n-button>
      </n-space>
      <ScriptPlayer 
        ref="scriptPlayer"
        @spp="spp"
      />
    </n-space>
  </div>
</template>

<script>
import { store } from './../store.js'
import ScriptPlayer from './ScriptPlayer.vue'
import {NButton, NSpace, NColorPicker} from 'naive-ui'
export default {
  components: {
    ScriptPlayer,
    NButton,
    NSpace,
    NColorPicker
  },
  data () {
    return {
      store,
    }
  },
  methods: {
    spp(x,y,c) {
      this.$emit("spp" ,x ,y, c)
    }
  },
  computed: {
    buttonLabel() {
      if(store.isLoggedIn) {
        return "COLORS"
      } else {
        return "LOGIN/REGISTER"
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