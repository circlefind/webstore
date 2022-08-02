import { api } from 'boot/axios'

export function user (state) {
  return api.get('/users/user').then((response) => {
    state.commit('setUser', response.data)
  })
}
export function finduser (state, data) {
  return api.post('/users/finduser', data).then((response) => {
    state.commit('setFindUser', response.data)
  })
}
export function usersecure (state) {
  return api.get('/users/usersecure').then((response) => {
    state.commit('setUserSecure', response.data)
  })
}
export function usernonsecure (state) {
  return api.get('/users/usernonsecure').then((response) => {
    state.commit('setUserNonSecure', response.data)
  })
}
export function userfield (state) {
  return api.get('/users/userfield').then((response) => {
    state.commit('setUserField', response.data)
  })
}
export function insertuser (state, data) {
  return api.post('/users/insertuser', data).then((response) => {
    state.commit('setUser', response.data)
  })
}
export function updateuser (state, data) {
  return api.post('/users/updateuser', data).then((response) => {
    state.commit('setUser', response.data)
  })
}
export function updateusersecure (state, data) {
  return api.post('/users/updateusersecure', data).then((response) => {
    state.commit('setUserSecure', response.data)
  })
}
export function deleteuser (state, data) {
  return api.post('/users/deleteuser', data).then((response) => {
    state.commit('setUser', response.data)
  })
}
