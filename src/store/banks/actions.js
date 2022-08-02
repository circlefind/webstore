import { api } from 'boot/axios'

export function getbank (state) {
  return api.get('/banks/bank').then((response) => {
    state.commit('setBank', response.data)
  })
}
export function insertbank (state, data) {
  return api.post('/banks/insertbank', data).then((response) => {
    state.commit('setBank', response.data)
  })
}
export function updatebank (state, data) {
  return api.post('/banks/updatebank', data).then((response) => {
    state.commit('setBank', response.data)
  })
}
export function deletebank (state, data) {
  return api.post('/banks/deletebank', data).then((response) => {
    state.commit('setBank', response.data)
  })
}
