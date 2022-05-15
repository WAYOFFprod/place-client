<template>
  <n-layout class="selector-container">
    <n-grid :x-gap="12" :y-gap="8" cols="1 600:2 1000:3 1200:4">
      <n-grid-item v-for="canvas in canvasStore.canvases" :key="canvas.id">
        <CanvasCard
          :data="canvas"
          @editCanvas="editCanvas"
        />
      </n-grid-item>
      <n-grid-item v-if="sessionStore.isLoggedIn && canMakeCanvas">
        <n-layout-content>
          <n-card title="Create a new Canvas">
            <template #action>
              <n-button @click="newCanvas">Create</n-button>
            </template>
          </n-card>
        </n-layout-content>
      </n-grid-item>
    </n-grid>
    <canvas-editor v-bind="activeCanvasData" :isNew="edit.isNew" :isOpen="edit.isOpen" :value="edit.value" @closeCanvas="closeCanvas" />
  </n-layout>
</template>

<script> 

import { NLayout, NGrid, NGridItem, NCard, NLayoutContent, NButton } from 'naive-ui'
import CanvasEditor from './CanvasEditor.vue'
import { canvasStore, sessionStore } from './../store.js'
import VueAxios from './common/http-common'
import CanvasCard from './CanvasCard.vue'

export default {
  mixins: [VueAxios],
  components: {
    NLayout,
    NGrid,
    NGridItem,
    NCard,
    NLayoutContent,
    NButton,
    CanvasCard,
    CanvasEditor
  },
  data() {
    return {
      sessionStore,
      canvasStore,
      edit: {
        isOpen: false,
        value: 0,
        isNew: false
      },
      delete: {
        value: 0
      }
    }
  },
  mounted() {
    this.getCanvases()
  },
  methods: {
    newCanvas() {
      this.edit.isNew = true
      this.edit.isOpen = true
    },
    getCanvases() {
      this.HTTP
      .get('canvas', { headers: {"Authorization" : 'Bearer ' + sessionStore.token}})
      .then(response => {
        let data = response.data
        canvasStore.canvases = data
      })
      .catch(error => {
        let e = JSON.parse(error.request.response); 
        console.log(e.code, e.message)
      })
    },
    editCanvas(canvasId) {
      this.edit.isNew = false
      this.edit.isOpen = true
      this.edit.value = canvasId
    },
    closeCanvas(data, isNew) {
      if(data) {
        if(isNew) {
          canvasStore.canvases.push(data)
        } else {
          for(let i = 0; i < canvasStore.canvases.length; i++) {
            if(canvasStore.canvases[i].id == data.id) {
              canvasStore.canvases[i] = data
            }
          }
        }
      }
      this.edit.isOpen = false;
    }
  },
  computed: {
    activeCanvasData() {
      for(let i = 0; i < canvasStore.canvases.length; i++) {
        if(canvasStore.canvases[i].id == this.edit.value) {
          return canvasStore.canvases[i]
        }
      }
      return {
        label: "Canvas",
        width: 1000,
        height: 1000,
        script_allowed: true,
        manual_allowed: true,
        private: false
      }
    },
    canMakeCanvas() {
      let mine = 0
      for(let i = 0; i < canvasStore.canvases.length; i++) {
        if(canvasStore.canvases[i].user_id == sessionStore.user.id) {
          mine++
        }
      }
      return mine < 2 || sessionStore.user.id == 1;
    }
  }
}
</script>

<style>
.selector-container {
  padding: 8px;
  padding-top: 60px;
  height: 100vh;
}
</style>