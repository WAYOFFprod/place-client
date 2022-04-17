<template>
  <n-drawer v-model:show="store.isMenuDrawerOpen" :width="502" placement="bottom">
      <n-drawer-content title="Colors">
        <StartMenu 
          v-if="!store.isLoggedIn && store.isFinishedConnecting"
          />
        <ColorSelector
          v-if="store.isLoggedIn"
          class="swatch-container"
          />
      </n-drawer-content>
    </n-drawer>
</template>

<script>
import ColorSelector from './ColorSelector.vue'
import StartMenu from './StartMenu.vue'
import { store } from './../store.js'
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
      store,
    }
  }
}
</script>

<style>

</style>