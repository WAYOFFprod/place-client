<template>
  <n-drawer v-model:show="UIStore.isScriptDrawerOpen" :height="height" placement="top" :on-after-leave="closeDrawer" :on-after-enter="openDrawer">
    <n-drawer-content>
      <template #header>
        <n-space>
          <n-space vertical >Script</n-space> <n-select size="small" v-model:value="scriptStore.scriptType" :options="scriptOptions" />
        </n-space>
      </template>
        <array-script
          ref="array"
          v-if="scriptStore.scriptType == 'array'"
          @update="drawPreview"
        />
        <copy-script
          ref="copy"
          v-if="scriptStore.scriptType == 'copy'"
        />
      <template #footer>
        <n-button @click="UIStore.toggleScriptDrawer()" >Close</n-button>
      </template>
      <n-space>
        <copy-script-preview></copy-script-preview>
      </n-space>
    </n-drawer-content>
  </n-drawer>
</template>

<script>
import { arraySS, canvasStore, scriptStore, UIStore, previewStore } from './../store.js'
import { NDrawer, NDrawerContent, NSpace, NButton, NSelect} from 'naive-ui'
import ArrayScript from './Scripts/ArrayScript.vue'
import CopyScript from './Scripts/CopyScript.vue'
import CopyScriptPreview from './Scripts/CopyScriptPreview.vue'

export default {
  components: {
    CopyScriptPreview,
    ArrayScript,
    CopyScript,
    NDrawer,
    NDrawerContent,
    NSpace,
    NButton,
    NSelect
  },
  created() {
  },
  data () {
    return {
      canvasStore,
      scriptStore,
      previewStore,
      UIStore,
      height: '95%',
      scriptOptions: [
        {
          label: "Array",
          value: "array",
        },
        {
          label: "Copy",
          value: "copy"
        }
      ]
    }
  },
  methods: {
    closeDrawer() {
      this.preview()
    },
    openDrawer() {
      this.clear()
    },
    startScript() {
      scriptStore.isScriptRunning = true
      this.$refs[scriptStore.scriptType].startScript()
    },
    preview() {
      this.$refs[scriptStore.scriptType].preview()
    },
    clear() {
      this.$refs[scriptStore.scriptType].clear()
    },
    drawPreview() {
      let pixelArray = JSON.parse("["+arraySS.pixelArrayStr+"]")
      const x2 = pixelArray[0].length
      const y2 = pixelArray.length
      previewStore.pixelArray = []
      for(let iy = 0; iy < y2; iy++) {
        previewStore.pixelArray[iy] = []
        for(let ix = 0; ix < x2; ix++) {
          const ci = pixelArray[iy][ix]
          if(ci < 0 || ci > arraySS.selectedColorList.length) {
            previewStore.pixelArray[iy][ix] = false
          } else {
            previewStore.pixelArray[iy][ix] = arraySS.selectedColorList[ci].color
          }
        }
      }
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
  }
}
</script>

<style>
.id-val {
  height: 100%;
  text-align: center;
  min-width: 20px;
  margin: 5px;
}
</style>