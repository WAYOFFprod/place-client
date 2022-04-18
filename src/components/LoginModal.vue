<template>
    <n-modal 
      :show="store.isModalOpen"
      preset="dialog"
      title="Dialog"
      :mask-closable="false"
      :style="bodyStyle"
      @handleCloseClick="closeModal">
      <template #header>
        <div>Account</div>
      </template>
        <n-form
          v-if="store.isRegistrationModalOpen"
          ref="formRefReg"
          :label-width="80"
          :model="formValue"
          :rules="rules"
          :size="size"
        >
          <n-grid :span="24" class="margin-top">
            <n-form-item-gi :span="24" class="center">
              <n-button @click="goLogin">
                Login
              </n-button>
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="Username" path="user.name">
              <n-input v-model:value="formValue.user.name" placeholder="username" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="Email" path="user.email">
              <n-input v-model:value="formValue.user.email" placeholder="email@wayoff.ch" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="Password" path="user.password">
              <n-input v-model:value="formValue.user.password" type="password" show-password-on="mousedown" placeholder="****" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" class="validation-right">
              <n-button @click="onRegister">
                Register
              </n-button>
            </n-form-item-gi>
          </n-grid>
        </n-form>

        
        <n-form
          v-if="store.isLoginModalOpen"
          ref="formRef"
          :label-width="80"
          :model="formValue"
          :rules="rules"
          :size="size"
        >
          <n-grid :span="24" class="margin-top">
            <n-form-item-gi :span="24" class="center">
              <n-button @click="goRegister">
                Create an account
              </n-button>
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="Email" path="user.email">
              <n-input v-model:value="formValue.user.email" placeholder="email@wayoff.ch" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="Password" path="user.password">
              <n-input v-model:value="formValue.user.password" type="password" show-password-on="mousedown" placeholder="****" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" class="validation-right">
              <n-button @click="onLogin">
                Login
              </n-button>
            </n-form-item-gi>
          </n-grid>
        </n-form>
    </n-modal>
</template>

<script>
import { NModal, NForm, NInput, NFormItemGi, NButton, NGrid} from 'naive-ui';
import {useMessage} from 'naive-ui'
import VueAxios from './common/http-common';
import { store } from './../store.js'
const Mode = {LOGIN: 0, REGISTER: 1}
export default {
  mixins: [VueAxios],
  mounted() {
    this.getInfo();
  },
  components: {
    NModal,
    NForm,
    NInput,
    NButton,
    NFormItemGi,
    NGrid,
  },
  data () {
    return {
      mode: Mode.LOGIN,
      store,
      message: null,
      showModal: false,
      formValue: {
        user: {
          email: '',
          password: ''
        }
      },
      rules: {
        user: {
          name: {
            required: true,
            message: 'Please input your name',
            trigger: 'blur'
          },
          age: {
            required: true,
            message: 'Please input your age',
            trigger: ['input', 'blur']
          }
        },
        phone: {
          required: true,
          message: 'Please input your number',
          trigger: ['input']
        }
      },
      errorMessage: useMessage()
    }
  },
  methods: {
    openRegister() {
      this.mode = Mode.REGISTER
      this.showModal = true
    },
    openLogin() {
      this.mode = Mode.LOGIN
      this.showModal = true
    },
    toggleMode() {
      if(this.mode == Mode.LOGIN) {
        this.mode = Mode.REGISTER
      } else {
        this.mode = Mode.LOGIN
      }
    },
    toggleShowModal() {
      this.showModal = !this.showModal
    },
    getInfo() {
      this.HTTP
        .get('me', { headers: {"Authorization" : 'Bearer ' + store.token}})
        .then(response => {
          store.user = response.data
          store.isFinishedConnecting = true
          store.isLoggedIn = true

        })
        .catch(error => {
          console.log(error.response.data.message)
          store.isFinishedConnecting = true
        })
    },
    onLogin (e) {
      e.preventDefault()
      const bodyFormData = new FormData()
      bodyFormData.append('email', this.formValue.user.email)
      bodyFormData.append('password', this.formValue.user.password)
      this.HTTP
        .post('login', bodyFormData)
        .then(response => {
          console.log(response.data)
          this.store.setToken(response.data.access_token)
          this.errorMessage.info(
            "Welcome back",
            {
              keepAliveOnHover: true
            }
          )
          this.store.closeModal()
        })
        .catch(error => {
          this.errorMessage.error(
            error.response.data.message,
            {
              keepAliveOnHover: true
            }
          )
        })
    },
    onRegister (e) {
      e.preventDefault()
      const bodyFormData = new FormData()
      bodyFormData.append('name', this.formValue.user.name)
      bodyFormData.append('email', this.formValue.user.email)
      bodyFormData.append('password', this.formValue.user.password)
      this.HTTP
        .post('register', bodyFormData)
        .then(response => {
          this.store.setToken(response.data.access_token)
          this.errorMessage.info(
            "Welcome, you can start placing pixels",
            {
              keepAliveOnHover: true
            }
          )
          this.store.closeModal()
        })
        .catch(error => {
          this.errorMessage.error(
            error.response.data.message,
            {
              keepAliveOnHover: true
            }
          )
        })
    },
    onClose (e) {
      console.log(e)
    },
    goRegister () {
      console.log("goRegister")
      this.mode = Mode.REGISTER
    },
    goLogin () {
      this.mode = Mode.LOGIN
    },
    closeModal () {
      this.showModal = false
    }
  },
  computed: {
    isLogin() {
      return this.mode == Mode.LOGIN
    },
    isRegistered() {
      return this.mode == Mode.REGISTER
    }
  }
}
</script>

<style>
.validation-right {
  display: flex;
  justify-content: flex-end
}
.margin-top {
  margin-top: 24px;
}
.center {
  display: flex;
  justify-content: center;
}
</style>