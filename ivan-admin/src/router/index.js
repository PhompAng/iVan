import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Hello from '@/components/Hello'
import Login from '@/components/auth/Login'
import Schools from '@/components/school/Schools'

Vue.use(Router)
Vue.use(VueResource)
Vue.http.options.root = 'http://127.0.0.1:3000'
Vue.http.options.xhr = {withCredentials: true}

var router = new Router({
  hashbang: false,
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Hello
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/schools',
      name: 'Schools',
      component: Schools
    }
  ]
})

export default router
