<template>
  <n-layout-content>
    <n-card :title="data.label">
      <template #cover>
        <canvas-preview 
          :canvasId="data.id"
          :width="data.width"
          :height="data.height"
        />
        <!-- <img src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"> -->
      </template>
      <ul>
        <li>Size: {{ data.width }} x {{ data.height }}</li>
        <li>Pixel placement: {{ isAllowed(data.script_allowed, data.manual_allowed) }}</li>
        <li>Owner: {{ data.user.name }}</li>
        <li>Visibility: {{ isPrivate(data.private) }}</li>
      </ul>
      <template #action>
        <n-space justify="space-between">
          <n-popconfirm
            v-if="sessionStore.isLoggedIn && ownCanvas"
            @positive-click="handlePositiveClick"
            @negative-click="handleNegativeClick"
          >
            <template #trigger>
              <n-button type="error" value="data.id">Delete</n-button>
            </template>
            Are you sure
          </n-popconfirm>
          
          <n-button v-if="sessionStore.isLoggedIn && ownCanvas" @click="editCanvas" value="data.id">Edit</n-button>
          <n-button type="primary" @click="openCanvas" value="data.id">Go</n-button>
        </n-space>
      </template>
    </n-card>
  </n-layout-content>
</template>

<script>
import { NCard, NLayoutContent, NButton, NSpace, NPopconfirm } from 'naive-ui'
import { canvasStore, sessionStore } from './../store'
import VueAxios from './common/http-common'
import CanvasPreview from './CanvasPreview.vue'

export default {
  props: ['data'],
  mixins: [VueAxios],
  components: {
    NCard,
    NLayoutContent,
    NButton,
    NSpace,
    NPopconfirm,
    CanvasPreview
  },
  data () {
    return {
      canvasStore,
      sessionStore
    }
  },
  methods: {
    isAllowed(script, manual) {
      if(script == 1 && manual == 1){
        return 'Script & manual'
      } else if(script == 1) {
        return 'Script only'
      } else if(manual == 1) {
        return 'Manual only'
      } else {
        return 'none???'
      }
    },
    isPrivate(val) {
      if(val == 1) {
        return 'private'
      } else {
        return 'public'
      }
    },
    openCanvas() {
      canvasStore.canvasId = this.data.id
    },
    editCanvas() {
      this.$emit("editCanvas", this.data.id)
    },
    handleNegativeClick() {

    },
    handlePositiveClick() {
      this.HTTP
        .delete('canvas/'+this.data.id, { headers: {"Authorization" : 'Bearer ' + sessionStore.token} })
        .then(() => {
          for(let i = 0; i < canvasStore.canvases.length; i++) {
            if(canvasStore.canvases[i].id == this.data.id) {
              canvasStore.canvases.splice(i, 1)
            }
          }
        })
        .catch(error => {
          let e = JSON.parse(error.request.response); 
          console.log(e.code, e.message)
        })
    },
  },
  computed: {
    ownCanvas() {
      return this.data.user_id == sessionStore.user.id
    }
  }
}
</script>

<style>
ul {
  list-style-type: none;
  padding-left: 8px;
}
li {

}
</style>