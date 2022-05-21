<template>
  <n-drawer v-model:show="UIStore.isScriptDrawerOpen" :height="height" placement="top" :on-after-leave="closeDrawer" :on-after-enter="openDrawer">
    <n-drawer-content>
      <template #header>
        <n-space>
          <n-space vertical >Script</n-space> <n-select size="small" v-model:value="scriptStore.scriptType" :options="scriptOptions" />
        </n-space>
      </template>
        <array-script ref="array" v-if="scriptStore.scriptType == 'array'"></array-script>
        <copy-script ref="copy" v-if="scriptStore.scriptType == 'copy'"></copy-script>
      <template #footer>
        <n-button @click="UIStore.toggleScriptDrawer()" >Close</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script>
import { canvasStore, scriptStore, UIStore } from './../store.js'
import { NDrawer, NDrawerContent, NSpace, NButton, NSelect} from 'naive-ui'
import ArrayScript from './Scripts/ArrayScript.vue'
import CopyScript from './Scripts/CopyScript.vue'

export default {
  components: {
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