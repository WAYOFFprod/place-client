<template>
<n-config-provider :theme="theme">
    <n-dialog-provider>
      <n-message-provider>
        <GameContainer />
    </n-message-provider>
    </n-dialog-provider>
</n-config-provider>
</template>

<script>
import GameContainer from './components/GameContainer.vue'
import {NConfigProvider, NMessageProvider, NDialogProvider} from 'naive-ui'
import { darkTheme } from 'naive-ui'

export default {
  name: 'App',
  components: {
    GameContainer,
    NMessageProvider,
    NDialogProvider,
    NConfigProvider
  },
  data() {
    return {
      darkTheme,
      theme: darkTheme,
    }
  },
  created() {
    window.addEventListener('wheel', function (event) {
      event.preventDefault()
    },{ passive: false })
  }
}
</script>

<style>
#app {
  widows: 100%;
  height: 100%;
  overflow: none;
}
body {
  height: 100%;
  overflow: hidden;
}
</style>
