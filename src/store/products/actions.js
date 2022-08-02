import { api } from 'boot/axios'

export function listproduct (state) {
  return api.get('/products/listproduct').then((response) => {
    state.commit('setListproduct', response.data)
  })
}
export function detailproduct (state, id) {
  return api.get('/products/detailproduct/' + id).then((response) => {
    state.commit('setProduct', response.data.product)
    state.commit('setImgproduct', response.data.imgproduct)
  })
}
export function productpromo (state) {
  return api.get('/products/productpromo').then((response) => {
    state.commit('setProductpromo', response.data)
  })
}
export function productcategory (state, id) {
  return api.get('/products/productcategory/' + id).then((response) => {
    state.commit('setProductcategory', response.data)
  })
}
export function productfilter (state, filter) {
  return api.get('/products/productfilter/' + filter).then((response) => {
    state.commit('setProductfilter', response.data)
  })
}
export function otherproduct (state, id) {
  return api.get('/products/otherproduct/' + id).then((response) => {
    state.commit('setOtherproduct', response.data)
  })
}
export function getproduct (state) {
  return api.get('/products/product').then((response) => {
    state.commit('setProduct', response.data)
  })
}
