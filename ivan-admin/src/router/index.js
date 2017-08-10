import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Hello from '@/components/Hello'
import Login from '@/components/auth/Login'

Vue.use(Router)
Vue.use(VueResource)
Vue.http.options.root = 'http://127.0.0.1:3000'
Vue.http.options.xhr = {withCredentials: true}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
