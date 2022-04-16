<template>
  <n-dialog-provider>
    <n-message-provider>
      <GameContainer />
  </n-message-provider>
  </n-dialog-provider>
</template>

<script>
import GameContainer from './components/GameContainer.vue'
import {NMessageProvider, NDialogProvider} from 'naive-ui'

export default {
  name: 'App',
  components: {
    GameContainer,
    NMessageProvider,
    NDialogProvider
  }
}
</script>

<style>
#app {
  widows: 100%;
  height: 100%;
  overflow: none;
}
</style>
