<template>
  <n-space :size="3" justify="center">
    <color-swatch 
      v-for="color in colors"
      :key="color" 
      :color="color" 
      :isDisabled="color == selectedColor"
      @colorSelected="colorSelected"
    />
  </n-space>
</template>

<script>
import { NSpace } from 'naive-ui'
import ColorSwatch from './ColorSwatch.vue'

export default {
  components: {
    ColorSwatch,
    NSpace
  },
  data() {
    return {
      selectedColor: '#fc2912',
      colors: [
        '#AA0000',
        '#AA5500',
        '#AAAA00',
        '#55AA00',
        '#00AA00',
        '#00AA55',
        '#00AAAA',
        '#0055AA',
        '#0000AA',
        '#5500AA',
        '#AA00AA',
        '#AA0055',
        
        '#ff0000',
        '#ffab05',
        '#ffff00',
        '#88ff00',
        '#00ff00',
        '#00ff88',
        '#00ffff',
        '#0088ff',
        '#0000ff',
        '#8800ff',
        '#ff00ff',
        '#ff0088',

        '#ffaaaa',
        '#ffddaa',
        '#ffffaa',
        '#ddffaa',
        '#aaffaa',
        '#aaffdd',
        '#aaffff',
        '#aaddff',
        '#aaaaff',
        '#ddaaff',
        '#ffaaff',
        '#ffaadd',

        '#bb7777',
        '#bb9977',
        '#bbbb77',
        '#99bb77',
        '#77bb77',
        '#77bb99',
        '#77bbbb',
        '#7799bb',
        '#7777bb',
        '#9977bb',
        '#bb77bb',
        '#bb7799',

        '#000000',
        '#171717',
        '#2E2E2E',
        '#454545',
        '#5C5C5C',
        '#737373',
        '#8B8B8B',
        '#A2A2A2',
        '#B9B9B9',
        '#D0D0D0',
        '#E7E7E7',
        '#FFFFFF',
      ]
    }
  },
  mounted () {
    this.$emit('selectedColor', this.colors[0]);
  },
  methods: {
    colorSelected(c) {
      this.selectedColor = c
      this.$emit("selectedColor", c)
    }
  },
  computed: {
    isSelected() {
      console.log(this)
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