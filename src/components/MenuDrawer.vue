<template>
  <n-drawer v-model:show="active" :width="502" placement="bottom">
      <n-drawer-content title="Colors">
        <StartMenu 
          v-if="!store.isLoggedIn && store.isFinishedConnecting"
          @openRegistration="openRegistration"
          @openLogin="openLogin"/>
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
  },
  methods: {
    openLogin() {
      this.$refs.loginModal.openLogin()
    },
    openRegistration() {
      this.$refs.loginModal.openRegister()
    },
  }
}
</script>

<style>

</style>