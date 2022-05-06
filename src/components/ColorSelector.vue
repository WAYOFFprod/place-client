<template>
  <n-space :size="3" justify="center">
    <color-swatch 
      v-for="color in canvasStore.colors"
      :key="color" 
      :color="color" 
      :isDisabled="color == canvasStore.selectedColor"
      @colorSelected="colorSelected"
    />
  </n-space>
</template>

<script>
import { canvasStore } from './../store.js'
import { NSpace } from 'naive-ui'
import ColorSwatch from './ColorSwatch.vue'

export default {
  components: {
    ColorSwatch,
    NSpace,
  },
  data() {
    return {
      canvasStore,
    }
  },
  mounted () {
    console.log("mounted")
    canvasStore.loadData()
  },
  methods: {
    colorSelected(c) {
      canvasStore.selectedColor = c
      canvasStore.saveData()
    }
  },
  computed: {
    isSelected() {
      return false
    }
  }
}
</script>

<style>
#color-palette {
  display: flex;
  gap: 5px;
  margin: 5px;

}
</style>