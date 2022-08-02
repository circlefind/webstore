import { api } from 'boot/axios'

export function getlisttransaction (state, id) {
  return api.get('/transactions/listtransaction/' + id).then((response) => {
    state.commit('setListtransaction', response.data)
  })
}
export function getnotification (state, id) {
  return api.get('/transactions/notification/' + id).then((response) => {
    state.commit('setNotification', response.data)
  })
}
export function addnotification (state, id) {
  return api.post('/transactions/addnotification/' + id).then((response) => {
    state.commit('setNotification', response.data)
  })
}
export function removenotification (state, id) {
  return api.post('/transactions/removenotification/' + id).then((response) => {
    state.commit('setNotification', response.data)
  })
}
export function updatetransfer (state, data) {
  return api.post('/transactions/updatetransfer', data).then((response) => {
    state.commit('setListtransaction', response.data)
  })
}
export function updatecourier (state, data) {
  return api.post('/transactions/updatecourier', data).then((response) => {
    state.commit('setListtransaction', response.data)
  })
}
export function updatearrived (state, data) {
  return api.post('/transactions/updatearrived', data).then((response) => {
    state.commit('setListtransaction', response.data)
  })
}
