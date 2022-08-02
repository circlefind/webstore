import { api } from 'boot/axios'

export function getcart (state, id) {
  return api.get('/carts/cart/' + id).then((response) => {
    state.commit('setCart', response.data)
  })
}
export function insertcart (state, data) {
  return api.post('/carts/insertcart', data).then((response) => {
    state.commit('setCart', response.data)
  })
}
export function updateqty (state, data) {
  return api.post('/carts/updateqty', data).then((response) => {
    state.commit('setCart', response.data)
  })
}
export function updateremark (state, data) {
  return api.post('/carts/updateremark', data).then((response) => {
    state.commit('setCart', response.data)
  })
}
export function deletecart (state, [id, iduser]) {
  return api.post('/carts/deletecart/' + id + '/' + iduser).then((response) => {
    state.commit('setCart', response.data)
  })
}
