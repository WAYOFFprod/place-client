<template>
  <button class="swatch" :style="{ background: color }" :disabled="isDisabled" @click="click"> </button>
</template>

<script>
export default {
  props: ['color', 'isDisabled'],
  components: [
  ],
  data() {
    return {
    }
  },
  methods: {
    click() {
      console.log(this);
      this.$emit('colorSelected', this.color);
    }
  }
}
</script>

<style>
.swatch{
  height: 40px;
  width: 40px;
}
</style>