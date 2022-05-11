<template>
    <n-modal 
      :show="UIStore.isModalOpen"
      preset="dialog"
      title="Dialog"
      :mask-closable="false"
      @handleCloseClick="closeModal">
      <template #header>
        <div>Account</div>
      </template>
        <n-form
          v-if="UIStore.isRegistrationModalOpen"
          :label-width="80"
          :model="formValue"
          :rules="rules"
        >
          <n-grid :span="24" class="margin-top">
            <n-form-item-gi :span="24" class="center">
              <n-button @click="UIStore.openLogin()">
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
          v-if="UIStore.isLoginModalOpen"
          ref="formRef"
          :label-width="80"
          :model="formValue"
          :rules="rules"
        >
          <n-grid :span="24" class="margin-top">
            <n-form-item-gi :span="24" class="center">
              <n-button @click="UIStore.openRegistration()">
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
import { UIStore, sessionStore } from './../store.js'

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
      UIStore,
      sessionStore,
      message: null,
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
      UIStore.openRegistration()
    },
    openLogin() {
      UIStore.openLogin()
    },
    getInfo() {
      this.HTTP
        .get('me', { headers: {"Authorization" : 'Bearer ' + sessionStore.token}})
        .then(response => {
          sessionStore.setUser(response.data)
          sessionStore.isFinishedConnecting = true
          sessionStore.isLoggedIn = true
          UIStore.closeModal()
        })
        .catch(error => {
          console.log(error.response.data.message)
          sessionStore.isFinishedConnecting = true
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
          UIStore.messagePlacement = 'top'
          this.sessionStore.setToken(response.data.access_token)
          this.errorMessage.info(
            "Welcome back",
            {
              keepAliveOnHover: true
            }
          )
          
          this.getUserData();
          UIStore.closeModal()
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
    getUserData() {
      this.HTTP
        .get('me', { headers: {"Authorization" : 'Bearer ' + sessionStore.token}})
        .then(response => {
          console.log(response)
          sessionStore.setUser(response.data);
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
          this.sessionStore.setToken(response.data.access_token)
          UIStore.messagePlacement = 'top'
          this.errorMessage.info(
            "Welcome, you can start placing pixels",
            {
              keepAliveOnHover: true
            }
          )
          this.sessionStore.closeModal()
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
    closeModal () {
      this.showModal = false
    }
  },
  computed: {

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