import { api } from 'boot/axios'

export function getcourier (state) {
  return api.get('/couriers/courier').then((response) => {
    state.commit('setCourier', response.data)
  })
}
export function insertcourier (state, data) {
  return api.post('/couriers/insertcourier', data).then((response) => {
    state.commit('setCourier', response.data)
  })
}
export function updatecourier (state, data) {
  return api.post('/couriers/updatecourier', data).then((response) => {
    state.commit('setCourier', response.data)
  })
}
export function deletecourier (state, data) {
  return api.post('/couriers/deletecourier', data).then((response) => {
    state.commit('setCourier', response.data)
  })
}
