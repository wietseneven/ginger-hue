import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/templates/Home"
import Install from "../components/templates/Install"

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/install',
      name: 'install',
      component: Install
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
