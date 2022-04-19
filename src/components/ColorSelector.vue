<template>
  <n-space :size="3" justify="center">
    <color-swatch 
      v-for="color in store.colors"
      :key="color" 
      :color="color" 
      :isDisabled="color == store.selectedColor"
      @colorSelected="colorSelected"
    />
  </n-space>
</template>

<script>
import { store } from './../store.js'
import { NSpace } from 'naive-ui'
import ColorSwatch from './ColorSwatch.vue'

export default {
  components: {
    ColorSwatch,
    NSpace,
  },
  data() {
    return {
      store,
    }
  },
  mounted () {
    console.log("palette mounted")
  },
  methods: {
    colorSelected(c) {
      this.store.selectedColor = c
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