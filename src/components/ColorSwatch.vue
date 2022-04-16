<template>
  <n-badge :value="value" :max="15">
    <n-button class="swatch" :color="color" :ghost="isDisabled" @click="click">
      <n-avatar
        :style="{
          backgroundColor: color
        }">
      </n-avatar>
    </n-button>
  </n-badge>
</template>

<script>
import {NButton, NAvatar} from 'naive-ui'

export default {
  props: ['color', 'isDisabled'],
  components: {
    NButton,
    NAvatar
  },
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