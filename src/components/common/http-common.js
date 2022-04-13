import axios from 'axios';

export const HTTP = axios.create({
  baseURL: 'http://'+process.env.VUE_APP_WEBSOCKET_SERVER+'/api/',
  headers: {
    Authorization: 'Bearer {token}'
  }
})