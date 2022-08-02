import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios
// ^ ^ ^ this will allow you to use this.$axios
//       so you won't necessarily have to import axios in each vue file
const api = axios.create({ baseURL: 'http://127.0.0.1:8000' })
Vue.prototype.$api = api

export { axios, api }
