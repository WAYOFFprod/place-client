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
  user: {},
  isScriptDrawerOpen: false,
  isMenuDrawerOpen: false,
  toggledrawer() {
    this.isMenuDrawerOpen = !this.isMenuDrawerOpen;
  },
  toggleScriptDrawer() {
    this.isScriptDrawerOpen = !this.isScriptDrawerOpen;
  },
  isModalOpen: false, 
  isLoginModalOpen: false,
  isRegistrationModalOpen: false,
  openRegistration() {
    this.isModalOpen = true
    this.isLoginModalOpen = false
    this.isRegistrationModalOpen = true
  },
  openLogin() {
    this.isModalOpen = true
    this.isLoginModalOpen = true
    this.isRegistrationModalOpen = false
  },
  closeModal() {
    this.isModalOpen = false
    this.isLoginModalOpen = false
    this.isRegistrationModalOpen = false
  },
  selectedColor: ''
})