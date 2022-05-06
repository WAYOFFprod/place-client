<template>
  <n-drawer v-model:show="UIStore.isScriptDrawerOpen" :width="502" placement="top" :on-after-leave="closeDrawer" :on-after-enter="openDrawer">
    <n-drawer-content title="Colors">
        <n-scrollbar x-scrollable>
          <n-space>
            <n-space vertical>
              <n-form-item label="Array" path="selectValue">
                <n-input
                  v-model:value="scriptStore.pixelArray"
                  type="textarea"
                  placeholder="Basic Textarea"
                />
              </n-form-item>
            </n-space>
            <n-space vertical>
              <n-form-item  label="Top Left corner X" path="start.x">
                <n-input-number v-model:value="scriptStore.start.x" clearable />
              </n-form-item>
              <n-form-item  label="Top Left corner Y" path="start.y">
                <n-input-number v-model:value="scriptStore.start.y" clearable />
              </n-form-item>
            </n-space>
             <n-space vertical>
              <n-form-item  label="Offset X" path="offset.x">
                <n-input-number v-model:value="scriptStore.offset.x" clearable />
              </n-form-item>
              <n-form-item  label="Offset Y" path="offset.y">
                <n-input-number v-model:value="scriptStore.offset.y" clearable />
              </n-form-item>
            </n-space>
            <n-space vertical>
              <n-scrollbar y-scrollable>
                <n-dynamic-input v-model:value="scriptStore.selectedColorList" :on-create="onCreateColor">
                  <template #create-button-default>
                    {{value}}
                  </template>
                  <template #default="{ value }">
                    <!-- <n-input v-model:value="value.id" type="text" /> -->
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
          </n-space>
        </n-scrollbar>
      </n-drawer-content>
    </n-drawer>
</template>

<script>
import { canvasStore, scriptStore, UIStore } from './../store.js'
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
      canvasStore,
      scriptStore,
      UIStore,
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
      this.scriptStore.isScriptRunning = true
    },
    onCreateColor() {
        return {
          id: scriptStore.selectedColorList.length,
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
.half-width {
  width: 50%;
}
.color-picker {
  min-width: 100px;
}
.id-val {
  height: 100%;
  text-align: center;
  min-width: 20px;
  margin: 5px;
}
</style>