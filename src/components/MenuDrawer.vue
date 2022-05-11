<template>
  <n-drawer v-model:show="UIStore.isMenuDrawerOpen" :width="502" placement="bottom">
      <n-drawer-content title="Colors">
        <StartMenu 
          v-if="!sessionStore.isLoggedIn && sessionStore.isFinishedConnecting"
          />
        <ColorSelector
          v-if="sessionStore.isLoggedIn"
          class="swatch-container"
          />
      </n-drawer-content>
    </n-drawer>
</template>

<script>
import ColorSelector from './ColorSelector.vue'
import StartMenu from './StartMenu.vue'
import { UIStore, sessionStore } from './../store.js'
import { NDrawer, NDrawerContent } from 'naive-ui'

export default {
  components: {
    ColorSelector,
    StartMenu,
    NDrawer,
    NDrawerContent
  },
  data () {
    return {
      UIStore,
      sessionStore,
    }
  }
}
</script>

<style>

</style>