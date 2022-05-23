<template>
  <n-tabs type="line" animated>
    <n-tab-pane name="position and offset" tab="Position & Offset">
      <n-form
          :label-width="80"
          :model="copySS"
          :rules="rules"
        >
        <n-space>
          <n-form-item  label="Left" path="start.x">
            <n-input-number v-model:value="copySS.bound.start.x" clearable />
          </n-form-item>
          <n-form-item  label="Right" path="end.x">
            <n-input-number v-model:value="copySS.bound.end.x" clearable />
          </n-form-item>
        </n-space>
        <n-space>
          <n-form-item  label="Top" path="start.y">
            <n-input-number v-model:value="copySS.bound.start.y" clearable />
          </n-form-item>
          <n-form-item  label="Bottom" path="end.y">
            <n-input-number v-model:value="copySS.bound.end.y" clearable />
          </n-form-item>
        </n-space>
        <n-space>
          <n-button @click="copy">copy</n-button>
          <n-button @click="save">save</n-button>
        </n-space>
      </n-form>
    </n-tab-pane>
  </n-tabs>
</template>

<script>

import VueAxios from './../common/http-common'
import { NSpace, NForm, NFormItem, NTabs, NTabPane, NInputNumber, NButton } from 'naive-ui'
import { useDialog } from 'naive-ui'
import { copySS, arraySS, sessionStore } from './../../store.js'

export default {
  mixins: [VueAxios],
  components: {
    NTabs,
    NTabPane,
    NInputNumber,
    NForm,
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
      sessionStore,
      dialog: useDialog(),
      rules: {
        start: {
          x: {
            validator: this.isSmallerX,
            message: "this value should be smaller than Right",
            trigger: ['blue','input']
          },
          y: {
            validator: this.isSmallerY,
            message: "this value should be smaller than Bottom",
            trigger: ['blue','input']
          }
        },
        end: {
          x: {
            validator: this.isLargerX,
            message: "this value should be larger than Left",
            trigger: ['blue','input']
          },
          y: {
            validator: this.isLargerY,
            message: "this value should be larger than Top",
            trigger: ['blue','input']
          },
        },
      },
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
          let message = ''
          let e = JSON.parse(error.request.response);
          for (const key in e.error) {
            for (let i = 0; i < e.error[key].length; i++) {
              message += e.error[key][i] + "\n";
            }
          }

          // display error
          this.dialog.error({
            title: 'Error',
            content: message,
            positiveText: 'OK',
            onPositiveClick: () => {
              console.log('done')
            }
          })
        })
    },
    preview() {
      copySS.active = true
    },
    clear() {
      copySS.active = false
    },
    isLargerX() {
      return copySS.bound.start.x < copySS.bound.end.x
    },
    isLargerY() {
      return copySS.bound.start.y < copySS.bound.end.y
    },
    isSmallerX() {
      return copySS.bound.start.x < copySS.bound.end.x
    },
    isSmallerY() {
      return copySS.bound.start.y < copySS.bound.end.y
    }
  }
}
</script>

<style>

</style>