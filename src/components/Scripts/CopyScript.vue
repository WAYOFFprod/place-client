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
            <n-input-number v-model:value="copySS.bound.start.x" @update:value="updateLeft" clearable />
          </n-form-item>
          <n-form-item  label="Right" path="end.x">
            <n-input-number v-model:value="copySS.bound.end.x" @update:value="updateRight" clearable />
          </n-form-item>
        </n-space>
        <n-space>
          <n-form-item  label="Top" path="start.y">
            <n-input-number v-model:value="copySS.bound.start.y" @update:value="updateTop" clearable />
          </n-form-item>
          <n-form-item  label="Bottom" path="end.y">
            <n-input-number v-model:value="copySS.bound.end.y" @update:value="updateBottom" clearable />
          </n-form-item>
        </n-space>
      </n-form>
    </n-tab-pane>
  </n-tabs>
  <n-input v-model:value="copySS.bound.label"></n-input>
  <n-button @click="copy($emit)">copy</n-button>
  <n-button @click="save">save</n-button>
</template>

<script>

import VueAxios from './../common/http-common'
import { NSpace, NForm, NFormItem, NTabs, NTabPane, NInputNumber, NButton, NInput } from 'naive-ui'
import { useDialog } from 'naive-ui'
import { copySS, arraySS, sessionStore, previewStore } from './../../store.js'

export default {
  mixins: [VueAxios],
  components: {
    NInput,
    NTabs,
    NTabPane,
    NInputNumber,
    NForm,
    NFormItem, 
    NSpace,
    NButton,
  },
  emits:[
    'update'
  ],
  mounted() {
    if(!copySS.isLoaded) {
      copySS.loadScriptData()
    }
    this.emitter.emit('storePixel')
  },
  unmounted() {
    copySS.saveScriptData()
  },
  data() {
    return {
      copySS,
      arraySS,
      sessionStore,
      previewStore,
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
      this.copyContent()
    },
    save() {
      console.log("save")
      this.copyContent()

      console.log(previewStore.pixelArrayStr)

      const bodyFormData = new FormData()
      bodyFormData.append('p_label', copySS.bound.label)
      bodyFormData.append('p_data', previewStore.pixelArrayStr)
      bodyFormData.append('p_is_private', 0)
      bodyFormData.append('c_label', copySS.bound.label)
      bodyFormData.append('c_data', JSON.stringify(previewStore.selectedColorList))
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
    copyContent() {

      previewStore.selectedColorList = []
      previewStore.pixelArrayStr = ""
      console.log(previewStore.pixelArray)
      for(let y = 0; y < previewStore.pixelArray.length; y++) {
        previewStore.pixelArrayStr += "["
        for (let x = 0; x < previewStore.pixelArray[y].length; x++) {
          let c = previewStore.pixelArray[y][x]
          let colorIndex = undefined
          if(c == false) {
            colorIndex = -1
          }
          
          let existingColor = previewStore.selectedColorList.filter(e => e.color === c)
          if(existingColor.length > 0){
            colorIndex = existingColor[0].id
          }

          if(colorIndex === undefined) {
            colorIndex = previewStore.selectedColorList.length
            previewStore.selectedColorList.push({
              id: colorIndex,
              color: c
            })
          }
          
          previewStore.pixelArrayStr += colorIndex
          if(x < previewStore.pixelArray[y].length - 1) {
            previewStore.pixelArrayStr += ","
          }
        }
        previewStore.pixelArrayStr += "]"
        if(y < previewStore.pixelArray.length - 1) {
          previewStore.pixelArrayStr += ",\n"
        }
      }

      console.log(previewStore.selectedColorList)
      console.log(previewStore.pixelArrayStr)
      // save starting bound as offset
      arraySS.start.x = copySS.bound.start.x
      arraySS.start.y = copySS.bound.start.y
    },
    preview() {
      previewStore.active = true
    },
    clear() {
      previewStore.active = false
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
    },
    updateLeft(v) {
      copySS.bound.start.x = v
      this.emitter.emit('storePixel')
    },
    updateRight(v) {
      copySS.bound.end.x = v
      this.emitter.emit('storePixel')
    },
    updateTop(v) {
      copySS.bound.start.y = v
      this.emitter.emit('storePixel')
    },
    updateBottom(v) {
      copySS.bound.end.y = v
      this.emitter.emit('storePixel')
    }
  }
}
</script>

<style>

</style>