import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import configs from './configs'
import regions from './regions'
import banners from './banners'
import users from './users'
import banks from './banks'
import couriers from './couriers'
import categories from './categories'
import products from './products'
import carts from './carts'
import transactions from './transactions'
import checkouts from './checkouts'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      configs,
      banners,
      regions,
      users,
      banks,
      couriers,
      categories,
      products,
      carts,
      transactions,
      checkouts
    }
    // strict: process.env.DEV
  })

  return Store
}
