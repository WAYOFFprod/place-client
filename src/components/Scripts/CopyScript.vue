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
      <n-space>
        <n-button @click="copy">copy</n-button>
        <n-button @click="save">save</n-button>
      </n-space>
    </n-tab-pane>
  </n-tabs>
</template>

<script>

import VueAxios from './../common/http-common'
import { NSpace, NFormItem, NTabs, NTabPane, NInputNumber, NButton } from 'naive-ui'
import { copySS, arraySS, sessionStore } from './../../store.js'

export default {
  mixins: [VueAxios],
  components: {
    NTabs,
    NTabPane,
    NInputNumber,
    NFormItem, 
    NSpace,
    NButton,
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
      copySS,
      arraySS,
      sessionStore
    }
  },
  methods: {
    copy() {
      this.emitter.emit("saveCopy")
    },
    save() {
      const bodyFormData = new FormData()
      bodyFormData.append('p_label', "pixels 1")
      bodyFormData.append('p_data', JSON.stringify(arraySS.pixelArray))
      bodyFormData.append('p_is_private', 0)
      bodyFormData.append('c_label', "color 1")
      bodyFormData.append('c_data', JSON.stringify(arraySS.selectedColorList))
      bodyFormData.append('c_is_private', 0)
      this.HTTP
        .post('preset/add', bodyFormData, { headers: {"Authorization" : 'Bearer ' + sessionStore.token} })
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          let e = JSON.parse(error.request.response); 
          console.log(e.code, e.message)
        })
    },
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