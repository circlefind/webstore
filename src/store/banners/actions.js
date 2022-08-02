import { api } from 'boot/axios'

export function getbanner (state) {
  return api.get('/banners/banner').then((response) => {
    state.commit('setBanner', response.data)
  })
}
export function updatebanner (state, data) {
  return api.post('/banners/updatebanner', data).then((response) => {
    state.commit('setBanner', response.data)
  })
}
export function getimgurl (state, imgname) {
  return api.get('/banners/getimage/' + imgname, { responseType: 'blob' })
}
