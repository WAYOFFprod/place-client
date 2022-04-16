import { reactive } from 'vue'


export const store = reactive({
  token: localStorage.getItem('id_token') || '',
  isFinishedConnecting: false,
  isLoggedIn: false,
  setToken(token) {
    localStorage.setItem('id_token', token)
    this.token = token
    this.isLoggedIn = true;
  },
  user: {}
})