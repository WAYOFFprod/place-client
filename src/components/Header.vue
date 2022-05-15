<template>
  <n-page-header @back="handleBack">
    <template #back>
      <n-icon v-if="isOnCanvas">
        <arrow-back />
      </n-icon> 
    </template>
    <template #title>
      <n-space>
        <!-- <a
          href="https://anyway.fm/"
          style="text-decoration: none; color: inherit"
        > -->
          {{ PageTitle }}
        <!-- </a> -->
        <!-- <n-statistic label="pixels" value="xxx" /> -->
      </n-space>
    </template>
    <template #avatar>
      <n-avatar
        :src="iconPath"
      />
    </template>
    <template #extra>
      <n-space>
        <n-color-picker
            v-if="sessionStore.isLoggedIn && isOnCanvas && canvasStore.isManualAllowed"
            class="color-picker"
            :show-alpha="false"
            :swatches="canvasStore.swatches"
            v-model:value="canvasStore.selectedColor"
            :modes="['hex']"
          />
        <n-button v-if="sessionStore.isLoggedIn && isOnCanvas && canvasStore.isManualAllowed" type="primary" @click="UIStore.toggledrawer()">
          COLORS
        </n-button>
        <n-button v-if="!sessionStore.isLoggedIn" type="primary" @click="UIStore.toggledrawer()">
          LOGIN / REGISTER
        </n-button>
        <n-button v-if="sessionStore.isLoggedIn" type="primary" @click="logout">
          LOGOUT
        </n-button>
        <n-button v-if="sessionStore.isLoggedIn && isOnCanvas && canvasStore.isScriptAllowed" type="primary" @click="UIStore.toggleScriptDrawer()">
          SCRIPT
        </n-button>
        <ScriptPlayer 
          v-if="sessionStore.isLoggedIn && isOnCanvas && canvasStore.isScriptAllowed"
          ref="scriptPlayer"
        />
      </n-space>
    </template>
  </n-page-header>
</template>

<script>
import { NPageHeader, NSpace, NButton, NAvatar, NColorPicker, NIcon} from 'naive-ui'
import { sessionStore, UIStore, canvasStore } from './../store.js'
import ScriptPlayer from './ScriptPlayer.vue'
import ArrowBack from '@vicons/ionicons5/ArrowBack'

export default {
  components: {
    ArrowBack,
    NPageHeader,
    NSpace,
    NButton,
    NAvatar,
    NColorPicker,
    NIcon,
    ScriptPlayer
  },
  mounted() {
    canvasStore.loadData()
  },
  data () {
    return {
      iconPath: process.env.BASE_URL + 'icon.png',
      sessionStore,
      UIStore,
      canvasStore,
      options: [
        {
          label: 'More episodes',
          key: '1'
        },
        {
          label: 'More episodes',
          key: '2'
        },
        {
          label: 'More episodes',
          key: '3'
        }
      ]
    }
  },
  methods: {
    handleBack () {
      canvasStore.canvasId = 0
    },
    logout() {
      sessionStore.isLoggedIn = false
    }
  },
  computed: {
    buttonLabel() {
      if(sessionStore.isLoggedIn) {
        return "COLORS"
      } else {
        return "LOGIN/REGISTER"
      }
    },
    isOnCanvas() {
      return canvasStore.canvasId > 0
    },
    PageTitle() {
      if(canvasStore.canvasId == 0) {
        return "Pixels"
      } else {
        return canvasStore.name
      }
    }
  }
}
</script>
 
<style>
.n-page-header-wrapper {
   background-color: black;
 }
.n-page-header {
  height: 60px;
  padding-right: 8px;
}
.n-page-header__back {
  width: 20px;
  padding-left: 10px;
}
</style>