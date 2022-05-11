<template>
  <n-layout-content>
    <n-card :title="data.label">
      <template #cover>
        <!-- <img src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"> -->
      </template>
      <ul>
        <li>Width: {{data.width}}</li>
        <li>Height: {{data.height}}</li>
        <li>Pixel placement: {{isAllowed(data.script_allowed, data.manual_allowed)}}</li>
        <li>Owner:</li>
        <li>Visibility: {{ isPrivate(data.private) }}</li>
      </ul>
      <template #action>
        <n-space justify="space-between">
          <n-button type="error" v-if="sessionStore.isLoggedIn && ownCanvas" @click="delCanvas" value="data.id">Delete</n-button>
          <n-button v-if="sessionStore.isLoggedIn && ownCanvas" @click="editCanvas" value="data.id">Edit</n-button>
          <n-button type="primary" @click="openCanvas" value="data.id">Go</n-button>
        </n-space>
      </template>
    </n-card>
  </n-layout-content>
</template>

<script>
import { NCard, NLayoutContent, NButton, NSpace } from 'naive-ui'
import { canvasStore, sessionStore } from './../store'

export default {
  props: ['data'],
  components: {
    NCard,
    NLayoutContent,
    NButton,
    NSpace
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
    delCanvas() {
      this.$emit("delCanvas", this.data.id)
    }
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