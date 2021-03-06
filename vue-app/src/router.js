import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Stocks from './views/Stocks.vue'
import Deliveries from './views/Deliveries.vue'
import Receivings from './views/Receivings.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Router)
Vue.use(BootstrapVue)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/stocks',
      name: 'stocks',
      component: Stocks
    },
    {
      path: '/deliveries',
      name: 'deliveries',
      component: Deliveries
    },
    {
      path: '/receivings',
      name: 'receivings',
      component: Receivings
    }
  ]
})
