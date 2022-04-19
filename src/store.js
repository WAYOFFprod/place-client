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
  selectedColor: '',
  isScriptRunning: false,
  pixelArray: '[0,0,0,0,0],\n' +
    "[0,0,1,0,0],\n" +
    "[0,1,1,1,0],\n" +
    "[0,0,1,0,0],\n" +
    "[0,0,0,0,0]",
  start: {
    x: 5,
    y: 5
  },
  selectedColorList: [{
    id: '0',
    color: '#ffffff'
  }, {
    id: '1',
    color: '##DA291C'
  }],
  colors: [
    '#AA0000',
    '#AA5500',
    '#AAAA00',
    '#55AA00',
    '#00AA00',
    '#00AA55',
    '#00AAAA',
    '#0055AA',
    '#0000AA',
    '#5500AA',
    '#AA00AA',
    '#AA0055',
    
    '#ff0000',
    '#ffab05',
    '#ffff00',
    '#88ff00',
    '#00ff00',
    '#00ff88',
    '#00ffff',
    '#0088ff',
    '#0000ff',
    '#8800ff',
    '#ff00ff',
    '#ff0088',

    '#ffaaaa',
    '#ffddaa',
    '#ffffaa',
    '#ddffaa',
    '#aaffaa',
    '#aaffdd',
    '#aaffff',
    '#aaddff',
    '#aaaaff',
    '#ddaaff',
    '#ffaaff',
    '#ffaadd',

    '#bb7777',
    '#bb9977',
    '#bbbb77',
    '#99bb77',
    '#77bb77',
    '#77bb99',
    '#77bbbb',
    '#7799bb',
    '#7777bb',
    '#9977bb',
    '#bb77bb',
    '#bb7799',

    '#000000',
    '#171717',
    '#2E2E2E',
    '#454545',
    '#5C5C5C',
    '#737373',
    '#8B8B8B',
    '#A2A2A2',
    '#B9B9B9',
    '#D0D0D0',
    '#E7E7E7',
    '#FFFFFF',
  ]
})