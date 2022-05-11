import axios from 'axios';


export default {
  data() {
    return {
      HTTP: null,
    }
  },
  mounted() {
    this.HTTP = axios.create({
      baseURL: 'http://'+process.env.VUE_APP_WEBSOCKET_SERVER+':8001/api/',
      headers: {
        Accept: 'application/json',
        Client: 'og-place'
      }
    })
  }
}