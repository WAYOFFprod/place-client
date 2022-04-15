<template>
    <n-modal :show="showModal" preset="dialog" title="Dialog" :mask-closable="false">
      <template #header>
        <div>Login</div>
      </template>
        <n-form
          ref="formRef"
          :label-width="80"
          :model="formValue"
          :rules="rules"
          :size="size"
        >
          <n-grid :span="24" class="margin-top">
            <n-form-item-gi :span="24" label="Email" path="user.email">
              <n-input v-model:value="formValue.user.email" placeholder="email@wayoff.ch" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="Password" path="user.password">
              <n-input v-model:value="formValue.user.password" placeholder="****" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" class="validation-right">
              <n-button @click="handleValidateClick">
                Login
              </n-button>
            </n-form-item-gi>
          </n-grid>
        </n-form>
    </n-modal>
</template>

<script>
import { NModal, NForm, NInput, NFormItemGi, NButton, NGrid} from 'naive-ui';
import VueAxios from './common/http-common';
import { store } from './../store.js'
export default {
  mixins: [VueAxios],
  mounted() {
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
    }
  },
  methods: {
    toggleShowModal() {
      this.showModal = !this.showModal
    },
    handleValidateClick (e) {
      e.preventDefault()
      const bodyFormData = new FormData()
      bodyFormData.append('email', this.formValue.user.email)
      bodyFormData.append('password', this.formValue.user.password)
      this.HTTP
        .post('login', bodyFormData)
        .then(response => {
          this.store.setToken(response.data.access_token)
          this.showModal = false
        })
        .catch(error => {
          console.log(error.response.data.message)
        })

    },
    onClose (e) {
      console.log(e)
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
</style>