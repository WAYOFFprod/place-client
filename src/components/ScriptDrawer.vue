<template>
  <n-drawer v-model:show="store.isScriptDrawerOpen" :width="502" placement="top">
      <n-drawer-content title="Colors">
        <n-button @click="startScript">
          RUN
        </n-button>
      </n-drawer-content>
    </n-drawer>
</template>

<script>
import { store } from './../store.js'
import { NDrawer, NDrawerContent, NButton } from 'naive-ui'

export default {
  components: {
    NDrawer,
    NDrawerContent,
    NButton
  },
  data () {
    return {
      store,
    }
  },
  methods: {
    startScript() {

    }
  }
}
</script>

<style>

</style>