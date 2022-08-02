import { api } from 'boot/axios'

export function getcategory (state) {
  return api.get('/categories/category').then((response) => {
    state.commit('setCategory', response.data)
  })
}
export function insertcategory (state, data) {
  return api.post('/categories/insertcategory', data).then((response) => {
    state.commit('setCategory', response.data)
  })
}
export function updatecategory (state, data) {
  return api.post('/categories/updatecategory', data).then((response) => {
    state.commit('setCategory', response.data)
  })
}
export function deletecategory (state, data) {
  return api.post('/categories/deletecategory', data).then((response) => {
    state.commit('setCategory', response.data)
  })
}
