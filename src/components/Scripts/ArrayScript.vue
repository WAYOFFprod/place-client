<template>
  <n-tabs type="line" animated>
    <n-tab-pane name="Array" tab="Array">
      <n-space vertical>
        <n-form-item label="Array" path="selectValue">
          <n-input
            v-model:value="arraySS.pixelArray"
            type="textarea"
            placeholder="Basic Textarea"
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
import { NSpace, NColorPicker, NDynamicInput, NFormItem, NScrollbar, NTabs, NTabPane, NInput, NInputNumber } from 'naive-ui'
import { canvasStore, UIStore, scriptStore, arraySS } from './../../store.js'
import {useDialog} from 'naive-ui'

export default {
  components: {
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
  },
  unmounted() {
    arraySS.saveScriptData()
  },
  data () {
    return {
      canvasStore,
      scriptStore,
      UIStore,
      arraySS,
      dialogViewed: false,
      dialog: useDialog(),
    }
  },
  methods: {
    onCreateColor() {
      return {
        id: arraySS.selectedColorList.length,
        color: ''
      };
    },
    setup() {
      arraySS.colors = []
      for (let i = 0; i < arraySS.selectedColorList.length; i++) {
        const element = arraySS.selectedColorList[i]
        arraySS.colors.push(element.color)
      }
      arraySS.sp.x = arraySS.start.x
      arraySS.sp.y = arraySS.start.y

      arraySS.pixels = this.parseJson("["+arraySS.pixelArray+"]")
      let ok = this.validate()
      if(ok) {
        arraySS.saveScriptData()
      }
    },
    preview() {
      this.setup()
      for(let y = 0; y < arraySS.pixels.length; y++) {
        if(y < arraySS.offset.y) continue
        for(let x = 0; x < arraySS.pixels[y].length; x++) {
          if(x < arraySS.offset.x && y == arraySS.offset.y) continue
          if(arraySS.pixels[y][x] < 0) continue
          const c = arraySS.colors[arraySS.pixels[y][x]] // get hex string
          this.emitter.emit('addToPreview', {x: arraySS.sp.x + x, y: arraySS.sp.y + y, c: c})
        }
      }
      scriptStore.isStarted = false
    },
    clear() {
      this.setup()
      this.dialogViewed = false
      for(let y = 0; y < arraySS.pixels.length; y++) {
        if(y < arraySS.offset.y) continue
        for(let x = 0; x < arraySS.pixels[y].length; x++) {
          if(x < arraySS.offset.x && y == arraySS.offset.y) continue
          const c = arraySS.colors[arraySS.pixels[y][x]] // get hex string
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
        if(arraySS.sp.x + arraySS.pixels[0].length > 100000 || arraySS.sp.y + arraySS.pixels.length > 1000000) {
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
    }
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