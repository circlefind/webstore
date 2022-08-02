<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  preFetch ({ store, redirect }) {
    redirect(false)
    store.dispatch('configs/config')
    store.dispatch('regions/getregion')
    store.dispatch('categories/getcategory')
    store.dispatch('couriers/getcourier')
    store.dispatch('banks/getbank')
    store
      .dispatch('auth/fetch')
      .then(() => {
        redirect(true)
      })
      .catch(() => {
        store.dispatch('auth/cleartoken')
        redirect({ name: 'home' })
      })
  }
}
</script>
