import Main from 'src/layouts/Main.vue'
import Home from 'pages/Home.vue'
import Productcategory from 'pages/Productcategory.vue'
import Productfilter from 'pages/Productfilter.vue'
import Productpromo from 'pages/Productpromo.vue'
import Product from 'pages/Product.vue'
import Authorized from 'pages/Authorized.vue'
import About from 'pages/About.vue'
import Transmethod from 'pages/Transmethod.vue'
import Cart from 'pages/Cart.vue'
import Checkout from 'pages/Checkout.vue'
import Transaction from 'pages/Transaction.vue'

const routes = [
  {
    path: '/',
    component: Main,
    children: [
      { path: '', component: Home },
      {
        path: 'authorized',
        name: 'authorized',
        component: Authorized,
        meta: { auth: true }
      },
      {
        path: 'home',
        name: 'home',
        component: Home,
        meta: { auth: false }
      },
      {
        path: 'productdetail/:id',
        name: 'product',
        component: Product,
        meta: { auth: false }
      },
      {
        path: 'productpromo',
        name: 'productpromo',
        component: Productpromo,
        meta: { auth: false }
      },
      {
        path: 'productcategory/:id',
        name: 'productcategory',
        component: Productcategory,
        meta: { auth: false }
      },
      {
        path: 'productfilter/:filter',
        name: 'productfilter',
        component: Productfilter,
        meta: { auth: false }
      },
      {
        path: 'about',
        name: 'about',
        component: About,
        meta: { auth: false }
      },
      {
        path: 'transmethod',
        name: 'transmethod',
        component: Transmethod,
        meta: { auth: false }
      },
      {
        path: 'cart',
        name: 'cart',
        component: Cart,
        meta: { auth: true }
      },
      {
        path: 'checkout',
        name: 'checkout',
        component: Checkout,
        meta: { auth: true }
      },
      {
        path: 'transaction',
        name: 'transaction',
        component: Transaction,
        meta: { auth: true }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
