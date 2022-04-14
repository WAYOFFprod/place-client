<template>
  <GameContainer />
</template>

<script>
import GameContainer from './components/GameContainer.vue'

export default {
  name: 'App',
  components: {
    GameContainer
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
