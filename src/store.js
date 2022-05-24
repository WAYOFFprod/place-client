import { reactive } from 'vue'

const canvasStore = reactive({
  s: 20, // pixel per "pixel" / scale
  ss: 100, // pixel per section
  gridXX: 1000, // grid size
  gridYY: 1000, // grid size
  tileSize: 10,
  isPrivate: false,
  isScriptAllowed: true,
  isManualAllowed: true,
  canvasId: 0,
  canvases: [],
  colorSelected() {
    if(this.swatches.includes(this.selectedColor)) {
      return
    }
    if(this.swatches.length > 15) {
      this.swatches.splice(2, 1);
    }
    this.swatches.push(this.selectedColor)
    this.saveData()
  },
  isPainting: true,
  swatches: [
    "#000000",
    "#ffffff"
  ],
  selectedColor: '#000000',
  saveData() {
    localStorage.setItem('swatch_history', JSON.stringify(this.swatches))
  },
  loadData() {
    if(localStorage.getItem('swatch_history') != null) {
      this.swatches = JSON.parse(localStorage.getItem('swatch_history'))
    }
  },
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
const sessionStore = reactive({
  token: localStorage.getItem('id_token') || '',
  isFinishedConnecting: false,
  isLoggedIn: false,
  setToken(token) {
    localStorage.setItem('id_token', token)
    this.token = token
    this.isLoggedIn = true;
  },
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
    this.user = user
  },
  user: {}
})

const scriptStore = reactive({
  isStarted: false,
  isPaused: false,
  percentage: 0,
  scriptType: "array",
  isScriptRunning: false,
})

const copySS = reactive({
  active: false,
  bound: {
    label: "",
    start: {
      x: 0,
      y: 0
    },
    end: {
      x: 20,
      y: 20
    }
  },
  pixelArray: [],
  isLoaded: false,
  saveScriptData() {
    localStorage.setItem('bound.start.x', this.bound.start.x)
    localStorage.setItem('bound.start.y', this.bound.start.y)
    localStorage.setItem('bound.end.x', this.bound.end.x)
    localStorage.setItem('bound.end.y', this.bound.end.y)
  },
  loadScriptData() {
    if(localStorage.getItem('bound.start.x') != null) {
      this.bound.start.x = parseInt(localStorage.getItem('bound.start.x'))
    }
    if(localStorage.getItem('bound.start.y') != null) {
      this.bound.start.y = parseInt(localStorage.getItem('bound.start.y'))
    }
    if(localStorage.getItem('bound.end.x') != null) {
      this.bound.end.x = parseInt(localStorage.getItem('bound.end.x'))
    }
    if(localStorage.getItem('bound.end.y') != null) {
      this.bound.end.y = parseInt(localStorage.getItem('bound.end.y'))
    }
    this.isLoaded = true
  }
})

const arraySS = reactive({
  pixelArray: '[0,0,0,0,0],\n' +
    "[0,0,1,0,0],\n" +
    "[0,1,1,1,0],\n" +
    "[0,0,1,0,0],\n" +
    "[0,0,0,0,0]",
  start: {
    x: 20,
    y: 20
  },
  offset: {
    x: 2,
    y: 0
  },
  selectedColorList: [{
    id: '0',
    color: '#DA291C'
  }, {
    id: '1',
    color: '#ffffff'
  }],
  colors: [],
  sp: {
    x: 0,
    y: 0
  },
  pixels: [],
  isLoaded: false,
  saveScriptData() {
    localStorage.setItem('pixel_array', this.pixelArray)
    localStorage.setItem('store_position', JSON.stringify(this.start))
    localStorage.setItem('start_offset', JSON.stringify(this.offset))
    localStorage.setItem('selected_color_list', JSON.stringify(this.selectedColorList))
  },
  loadScriptData() {
    if(localStorage.getItem('pixel_array') != null) {
      this.pixelArray = localStorage.getItem('pixel_array')
    }
    if(localStorage.getItem('store_position')!= null) {
      this.start = JSON.parse(localStorage.getItem('store_position'))
    }
    if(localStorage.getItem('start_offset')!= null) {
      this.offset = JSON.parse(localStorage.getItem('start_offset'))
    }
    if(localStorage.getItem('selected_color_list')!= null) {
      this.selectedColorList = JSON.parse(localStorage.getItem('selected_color_list'))
    }
    this.isLoaded = true
  }
})

const UIStore = reactive({
  isScriptDrawerOpen: false,
  isMenuDrawerOpen: false,
  messagePlacement: 'bottom',
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
    console.log("register")
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
    this.isMenuDrawerOpen = false
    this.isModalOpen = false
    this.isLoginModalOpen = false
    this.isRegistrationModalOpen = false
  }
})

export {canvasStore, sessionStore, scriptStore, UIStore, arraySS, copySS }