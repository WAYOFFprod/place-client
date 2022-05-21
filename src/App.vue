<template>
<n-config-provider :theme="theme">
  <n-notification-provider>
    <n-dialog-provider>
      <n-message-provider :placement="UIStore.messagePlacement">
        <Header />
        <game-container v-if="canvasStore.canvasId > 0" class="selector-container"/>
        <canvas-selector v-if="canvasStore.canvasId == 0" class="selector-container"/>
        <menu-drawer />
        <login-modal />
      </n-message-provider>
    </n-dialog-provider>
  </n-notification-provider>
</n-config-provider>
</template>

<script>
import GameContainer from './components/GameContainer.vue'
import CanvasSelector from './components/CanvasSelector.vue'
import MenuDrawer from './components/MenuDrawer.vue'
import LoginModal from './components/LoginModal.vue'
import Header from './components/Header.vue'
import { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider} from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { UIStore, canvasStore } from './store.js'

export default {
  name: 'App',
  components: {
    GameContainer,
    CanvasSelector,
    Header,
    MenuDrawer,
    LoginModal,
    NNotificationProvider,
    NMessageProvider,
    NDialogProvider,
    NConfigProvider
  },
  data() {
    return {
      UIStore,
      darkTheme,
      canvasStore,
      isStatic: false,
      theme: darkTheme,
    }
  },
}
</script>

<style>
#app {
  widows: 100%;
  height: 100%;
}
.p5Canvas {
  overflow: none;
}
body {
  height: 100%;
}
.n-page-header-wrapper {
  position: fixed;
  z-index: 1;
  top: 0;
  width: 100%;
}
.selector-container {
  padding: 8px;
  padding-top: 60px;
  height: 100vh;
}
</style>
