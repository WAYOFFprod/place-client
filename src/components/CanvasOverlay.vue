<template>
  <div class="static-container">
    <n-space :size="24" align="center" v-if="store.isFinishedConnecting">
      <n-button type="primary" @click="store.toggledrawer()">
        {{ buttonLabel }}
      </n-button>
      <n-button v-if="store.isLoggedIn" type="primary" @click="store.toggleScriptDrawer">
        SCRIPT
      </n-button>
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
import {NButton, NSpace} from 'naive-ui'
export default {
  components: {
    ScriptPlayer,
    NButton,
    NSpace
  },
  data () {
    return {
      store,
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

</style>