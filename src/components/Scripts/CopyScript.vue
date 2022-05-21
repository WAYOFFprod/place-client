<template>
  <n-tabs type="line" animated>
    <n-tab-pane name="position and offset" tab="Position & Offset">
      <n-space vertical>
        <n-form-item  label="Top Left corner X" path="start.x">
          <n-input-number v-model:value="copySS.bound.start.x" clearable />
        </n-form-item>
        <n-form-item  label="Top Left corner Y" path="start.y">
          <n-input-number v-model:value="copySS.bound.start.y" clearable />
        </n-form-item>
      </n-space>
        <n-space vertical>
        <n-form-item  label="Bottom Right X" path="end.x">
          <n-input-number v-model:value="copySS.bound.end.x" clearable />
        </n-form-item>
        <n-form-item  label="Bottom Right Y" path="end.y">
          <n-input-number v-model:value="copySS.bound.end.y" clearable />
        </n-form-item>
      </n-space>
    </n-tab-pane>
  </n-tabs>
</template>

<script>
import { NSpace, NFormItem, NTabs, NTabPane, NInputNumber } from 'naive-ui'
import { copySS } from './../../store.js'

export default {
  components: {
    NTabs,
    NTabPane,
    NInputNumber,
    NFormItem, 
    NSpace,
  },
  mounted() {
    if(!copySS.isLoaded) {
      copySS.loadScriptData()
    }
  },
  unmounted() {
    copySS.saveScriptData()
  },
  data() {
    return {
      copySS
    }
  },
  methods: {
    preview() {
      copySS.active = true
    },
    clear() {
      copySS.active = false
    }
  }
}
</script>

<style>

</style>