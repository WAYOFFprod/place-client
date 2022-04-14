import axios from 'axios';

export const HTTP = axios.create({
  baseURL: 'http://'+process.env.VUE_APP_WEBSOCKET_SERVER+':8001/api/',
  headers: {
    Authorization: 'Bearer {token}'
  }
})