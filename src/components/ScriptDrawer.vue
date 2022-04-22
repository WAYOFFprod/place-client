<template>
  <n-drawer v-model:show="store.isScriptDrawerOpen" :width="502" placement="top" :on-after-leave="closeDrawer" :on-after-enter="openDrawer">
    <n-drawer-content title="Colors">
        <n-scrollbar x-scrollable>
          <n-space>
            <n-space vertical>
              <n-form-item label="Array" path="selectValue">
                <n-input
                  v-model:value="store.pixelArray"
                  type="textarea"
                  placeholder="Basic Textarea"
                />
              </n-form-item>
            </n-space>
            <n-space vertical>
              <n-form-item  label="Top Left corner X" path="start.x">
                <n-input-number v-model:value="store.start.x" clearable />
              </n-form-item>
              <n-form-item  label="Top Left corner Y" path="start.y">
                <n-input-number v-model:value="store.start.y" clearable />
              </n-form-item>
            </n-space>
             <n-space vertical>
              <n-form-item  label="Offset X" path="offset.x">
                <n-input-number v-model:value="store.offset.x" clearable />
              </n-form-item>
              <n-form-item  label="Offset Y" path="offset.y">
                <n-input-number v-model:value="store.offset.y" clearable />
              </n-form-item>
            </n-space>
            <n-space vertical>
              <n-dynamic-input v-model:value="store.selectedColorList" :on-create="onCreateColor">
                <template #create-button-default>
                  Add whatever you want
                </template>
                <template #default="{ value }">
                  <!-- <n-input v-model:value="value.id" type="text" /> -->
                  <n-color-picker
                    class="color-picker"
                    v-model:value="value.color"
                    :swatches="[
                      '#FFFFFF',
                      '#18A058',
                      '#2080F0',
                      '#F0A020',
                      'rgba(208, 48, 80, 1)'
                    ]"
                  />
                </template>
              </n-dynamic-input>
            </n-space>
          </n-space>
        </n-scrollbar>
      </n-drawer-content>
    </n-drawer>
</template>

<script>
import { store } from './../store.js'
import { NDrawer, NDrawerContent, NScrollbar, NInput, NSpace, NInputNumber, NFormItem, NDynamicInput, NColorPicker} from 'naive-ui'

export default {
  components: {
    NDrawer,
    NDrawerContent,
    NScrollbar,
    NInput,
    NSpace,
    NInputNumber,
    NFormItem,
    NDynamicInput,
    NColorPicker
  },
  data () {
    return {
      store,
    }
  },
  methods: {
    closeDrawer() {
      this.emitter.emit("preview")
    },
    openDrawer() {
      this.emitter.emit("clear")
    },
    startScript() {
      this.store.isScriptRunning = true
    },
    onCreateColor() {
        return {
          id: '',
          color: ''
        };
      }
  },
  computed: {
    buttonLabel() {
      if(this.store.isScriptRunning) {
        return "PAUSE"
      } else {
        return "RUN"
      }
    },
    colorList () {
      const colorSelect = []
      for (let i = 0; i < store.colors.length; i++) {
        const element = store.colors[i];
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
.half-width {
  width: 50%;
}
.color-picker {
  min-width: 100px;
}
</style>