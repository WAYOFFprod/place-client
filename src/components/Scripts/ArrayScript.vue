<template>
  <n-tabs type="line" animated>
    <n-tab-pane name="load and save" tab="Load & Save">
      <n-space vertical>
        <n-form-item label="select" path="select">
          <n-select v-model:value="preset.value" :on-update:value="presetSelected" :options="preset.options" />
        </n-form-item>
      </n-space>
      <n-space vertical>
        <n-form-item label="Array" path="preset.label">
          <n-input
            v-model:value="preset.label"
            placeholder="label"
          />
        </n-form-item>
        <n-button @click="save">save</n-button>
      </n-space>
    </n-tab-pane>
    <n-tab-pane name="Array" tab="Array">
      <n-space vertical>
        <n-form-item label="Array" path="selectValue">
          <n-input
            v-model:value="arraySS.pixelArrayStr"
            type="textarea"
            placeholder="Basic Textarea"
            @update:value="updateGrid"
          />
        </n-form-item>
      </n-space>
    </n-tab-pane>
    <n-tab-pane name="color" tab="Color">
      <n-space vertical>
        <n-scrollbar y-scrollable>
          <n-dynamic-input v-model:value="arraySS.selectedColorList" :on-create="onCreateColor">
            <template #create-button-default>
              {{value}}
            </template>
            <template #default="{ value }">
              <span class="id-val">{{ value.id }}</span>
              <n-color-picker
                class="color-picker"
                v-model:value="value.color"
                :show-alpha="false"
                :modes="['hex']"
                @update:value="updateColor"
              />
            </template>
          </n-dynamic-input>
        </n-scrollbar>
      </n-space>
    </n-tab-pane>
    <n-tab-pane name="position and offset" tab="Position & Offset">
      <n-space vertical>
        <n-form-item  label="Top Left corner X" path="start.x">
          <n-input-number v-model:value="arraySS.start.x" clearable />
        </n-form-item>
        <n-form-item  label="Top Left corner Y" path="start.y">
          <n-input-number v-model:value="arraySS.start.y" clearable />
        </n-form-item>
      </n-space>
      <n-space vertical>
        <n-form-item  label="Offset X" path="offset.x">
          <n-input-number v-model:value="arraySS.offset.x" clearable />
        </n-form-item>
        <n-form-item  label="Offset Y" path="offset.y">
          <n-input-number v-model:value="arraySS.offset.y" clearable />
        </n-form-item>
      </n-space>
    </n-tab-pane>
  </n-tabs>
</template>

<script>
import VueAxios from './../common/http-common'
import { NSpace, NColorPicker, NDynamicInput, NFormItem, NScrollbar, NTabs, NTabPane, NInput, NInputNumber, NSelect, NButton} from 'naive-ui'
import { canvasStore, UIStore, scriptStore, arraySS, sessionStore, previewStore } from './../../store.js'
import {useDialog} from 'naive-ui'

export default {
  mixins: [VueAxios],
  components: {
    NButton,
    NSelect,
    NSpace,
    NTabs,
    NTabPane,
    NScrollbar,
    NInput,
    NInputNumber,
    NFormItem, 
    NDynamicInput,
    NColorPicker,
  },
  mounted() {
    if(!arraySS.isLoaded) {
      arraySS.loadScriptData()
    }
    this.HTTP
      .get('preset/pixels')
      .then(response => {
        this.data = response.data
        for (let i = 0; i < this.data.length; i++) {
          const e = this.data[i];

          this.preset.options.push({
            label: e.label,
            value: i+"",
          })
        }
      })
      .catch(error => {
        let e = JSON.parse(error.request.response); 
        console.log(e.code, e.message)
      })
  },
  unmounted() {
    arraySS.saveScriptData()
  },
  data () {
    return {
      sessionStore,
      canvasStore,
      scriptStore,
      UIStore,
      arraySS,
      dialogViewed: false,
      dialog: useDialog(),
      preset: {
        label: "",
        value: '',
        options: [

        ]
      },
      data: []
    }
  },
  methods: {
    onCreateColor() {
      return {
        id: arraySS.selectedColorList.length,
        color: ''
      };
    },
    presetSelected(i) {
      this.preset.value = i
      let data = this.data[this.preset.value]
      arraySS.pixelArrayStr = data.data
      arraySS.selectedColorList = JSON.parse(data.color_selection.data)
      this.$emit('update')
    },
    setup() {
      arraySS.colors = []
      for (let i = 0; i < arraySS.selectedColorList.length; i++) {
        const element = arraySS.selectedColorList[i]
        arraySS.colors.push(element.color)
      }
      arraySS.sp.x = arraySS.start.x
      arraySS.sp.y = arraySS.start.y

      previewStore.pixelArray = this.parseJson("["+arraySS.pixelArrayStr+"]")
      let ok = this.validate()
      if(ok) {
        arraySS.saveScriptData()
      }
    },
    updateColor(){
      this.$emit('update')
    },
    updateGrid(){
      console.log("what")
      this.$emit('update')
    },
    preview() {
      this.setup()
      for(let y = 0; y < previewStore.pixelArray.length; y++) {
        if(y < arraySS.offset.y) continue
        for(let x = 0; x < previewStore.pixelArray[y].length; x++) {
          if(x < arraySS.offset.x && y == arraySS.offset.y) continue
          if(previewStore.pixelArray[y][x] < 0) continue
          const c = arraySS.colors[previewStore.pixelArray[y][x]] // get hex string
          this.emitter.emit('addToPreview', {x: arraySS.sp.x + x, y: arraySS.sp.y + y, c: c})
        }
      }
      scriptStore.isStarted = false
    },
    clear() {
      this.setup()
      this.dialogViewed = false
      for(let y = 0; y < previewStore.pixelArray.length; y++) {
        if(y < arraySS.offset.y) continue
        for(let x = 0; x < previewStore.pixelArray[y].length; x++) {
          if(x < arraySS.offset.x && y == arraySS.offset.y) continue
          const c = arraySS.colors[previewStore.pixelArray[y][x]] // get hex string
          this.emitter.emit('clearPreview', {x: arraySS.sp.x + x, y: arraySS.sp.y + y, c: c})
        }
      }
      scriptStore.percentage = 0
      scriptStore.isPaused = true
      scriptStore.isStarted = false
    },
    parseJson(str) {
      try {
        return JSON.parse(str);
      } catch (e) {
        console.log(e);
        if(!this.dialogViewed) {
          this.dialogViewed = true
          this.dialog.error({
            title: 'there seem to be an issue with the arrays',
            content: 'Make sure you didn\'t forget anything',
            positiveText: 'Ok!',
            onPositiveClick: () => {
              UIStore.isScriptDrawerOpen = true
            }
          })
        }
        return false;
      }
    },
    validate() {
      let isValid = true
      isValid = this.checkCoords()
      return isValid
    },
    checkCoords() {
      if(!this.dialogViewed) {
        this.dialogViewed = true
        if(arraySS.sp.x < 0 || arraySS.sp.y < 0) {
          this.dialog.error({
            title: 'X or Y coordinate are negative.',
            content: 'Can\'t have that!',
            positiveText: 'Ok!',
            onPositiveClick: () => {
              UIStore.isScriptDrawerOpen = true
            }
          })
          return false
        }
        if(arraySS.sp.x + previewStore.pixelArray[0].length > 100000 || arraySS.sp.y + previewStore.pixelArray.length > 1000000) {
          this.dialog.error({
            title: 'Your drawing goes too far.',
            content: 'Can\'t have that!',
            positiveText: 'Ok!',
            onPositiveClick: () => {
              UIStore.isScriptDrawerOpen = true
            }
          })
          return false
        }
      }
      return true
    },
    save() {
      const bodyFormData = new FormData()
      bodyFormData.append('p_label', this.preset.label)
      bodyFormData.append('p_data', previewStore.pixelArrayStr)
      bodyFormData.append('p_is_private', 0)
      bodyFormData.append('c_label', this.preset.label)
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
          console.log(message);

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
  },
  computed: {
    colorList () {
      const colorSelect = []
      for (let i = 0; i < canvasStore.colors.length; i++) {
        const element = canvasStore.colors[i];
        colorSelect.push({
          label: element,
          value: element,
        })
      }
      return colorSelect
    },
  }
}
</script>

<style>
.color-picker {
  min-width: 100px;
}
.half-width {
  width: 50%;
}
</style>