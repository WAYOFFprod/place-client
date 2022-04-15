import axios from 'axios';
import { store } from './../../store.js'


export default {
  data() {
    return {
      HTTP: null,
      store
    }
  },
  mounted() {
    let t = this
    this.HTTP = axios.create({
      baseURL: 'http://'+process.env.VUE_APP_WEBSOCKET_SERVER+':8001/api/',
      headers: {
        Authorization: 'Bearer' + t.store.token,
        Accept: 'application/json'
      }
    })
  }
}