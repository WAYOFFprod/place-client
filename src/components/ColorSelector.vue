<template>
  <div id="color-palette">
    <color-swatch 
      v-for="color in colors"
      :key="color" 
      :color="color" 
      :isDisabled="color == selectedColor"
      @colorSelected="colorSelected"
    />
  </div>
</template>

<script>
import ColorSwatch from './ColorSwatch.vue'

export default {
  components: {
    ColorSwatch
  },
  data() {
    return {
      selectedColor: '#fc2912',
      colors: [
        "#f44336",
        "#e91e63",
        "#9c27b0",
        "#673ab7",
        "#3f51b5",
        "#2196f3",
        "#03a9f4",
        "#00bcd4",
        "#009688",
        "#4caf50",
        "#8bc34a",
        "#cddc39",
        "#ffeb3b",
        "#ffc107",
        "#ff9800",
        "#ff5722",
        "#795548",
        "#9e9e9e",
        "#607d8b",
        "#ffffff",
        "#000000"
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