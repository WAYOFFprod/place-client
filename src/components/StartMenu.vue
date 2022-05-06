<template>

<n-space vertical>
    <span class="center">Login or register to start placing pixels</span>
    <n-space justify="center" align="center" size="large">
      <n-button class="button" @click="register">
        Register
      </n-button>
      <n-button class="button" @click="login">
        Login
      </n-button>
    </n-space>
    <span class="center">for bots, you should be able to intercept the token onces you have an account, the token stays valid until you login again</span>
  </n-space>
</template>

<script>

import  { UIStore } from './../store.js'
import { NButton, NSpace } from 'naive-ui'; 
import { useMessage, useDialog } from 'naive-ui'; 

export default {
  components: {
    NSpace,
    NButton,
  },
  data () {
    return {
      message: useMessage(),
      dialog: useDialog(),
      UIStore
    }
  },
  mounted() {
    this.message = useMessage();
    this.dialog = useDialog();
  },
  methods: {
    register () {
      this.UIStore.openRegistration()
    },
    login() {
      this.UIStore.openLogin()
    },
    handleConfirm() {
      this.dialog.warning({
        title: "",
        content: "Are you sure?",
        positiveText: "Sure",
        negativeText: "Not Sure",
        onPositiveClick: () => {
          this.message.success("Sure")
        },
        onNegativeClick: () => {
          this.message.error("Not Sure")
        }
      });
    },
    handleSuccess() {
      this.dialog.success({
        title: "Success",
        content: "Cool",
        positiveText: "Wow!",
        onPositiveClick: () => {
          this.message.success("Great!")
        }
      });
    },
    handleError() {
      this.dialog.error({
        title: "Error",
        content: "A mistake.",
        positiveText: "Ahhh!",
        onPositiveClick: () => {
          this.message.success("I knew it...")
        }
      })
    }
  }
}
</script>

<style>
.button{
  margin: 0 10px;
}
.center {
  text-align: center;
}
</style>