import { createApp } from 'vue'
import App from './App.vue'
import Echo from "laravel-echo";
import 'vfonts/FiraCode.css'

window.Pusher = require('pusher-js')
window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.VUE_APP_WEBSOCKET_KEY,
  wsHost: process.env.VUE_APP_WEBSOCKET_SERVER,
  wsPort: 6001,
  forceTLS: false,
  disableStats: true
})

createApp(App).mount('#app')

