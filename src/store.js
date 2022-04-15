import { reactive } from 'vue'

export const store = reactive({
  token: localStorage.getItem('id_token') || '',
  setToken(token) {
    localStorage.setItem('id_token', token)
    this.token = token
  },
})