import { api } from 'boot/axios'

export function getregion (state) {
  return api.get('/regions/region').then((response) => {
    state.commit('setRegion', response.data)
  })
}
