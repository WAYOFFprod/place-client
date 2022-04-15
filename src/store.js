import { reactive } from 'vue'

export const store = reactive({
  token: '',
  setToken(token) {
    this.token = token
  }
})