import { api } from 'boot/axios'

export function insertcheckout (state, data) {
  return api.post('/checkouts/insertcheckout', data).then((response) => {
    state.commit('setCheckout', response.data)
  })
}
export function getcheckout (state, id) {
  return api.get('/checkouts/checkout/' + id).then((response) => {
    state.commit('setCheckout', response.data)
  })
}
