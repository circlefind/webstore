import { api } from 'boot/axios'

export function config (state) {
  return api.get('/configs/config').then((response) => {
    state.commit('setConfig', response.data)
  })
}
export function updateconfig (state, data) {
  return api.post('/configs/updateconfig', data).then((response) => {
    state.commit('setConfig', response.data)
  })
}
export function serverdate (state) {
  return api.get('/configs/serverdate').then((response) => {
    state.commit('setServerDate', response.data)
  })
}
export function getpaper (state) {
  return api.get('/configs/paper').then((response) => {
    state.commit('setPaper', response.data)
  })
}
export function setloadstate (state, data) {
  state.commit('setLoadState', data)
}
export function routeclear () {
  return api.get('/configs/routeclear')
}
export function routecache () {
  return api.get('/configs/routecache')
}
export function optimize () {
  return api.get('/configs/optimize')
}
