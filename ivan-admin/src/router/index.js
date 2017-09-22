import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Hello from '@/components/Hello'
import Login from '@/components/auth/Login'
import Schools from '@/components/school/Schools'
import ViewSchool from '@/components/school/ViewSchool'
import store from '../vuex/store'
import * as firebase from 'firebase'
import Admins from '@/components/admin/Admins'

Vue.use(Router)
Vue.use(VueResource)
Vue.http.options.root = 'http://127.0.0.1:3000'
Vue.http.options.xhr = {
  withCredentials: true
}

var router = new Router({
  hashbang: false,
  linkActiveClass: 'active',
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Dashboard',
    component: Hello,
    meta: {
      role: 0
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/schools',
    name: 'Schools',
    component: Schools,
    meta: {
      role: 99
    }
  },
  {
    path: '/schools/:id',
    name: 'ViewSchool',
    component: ViewSchool,
    meta: {
      role: 99
    }
  },
  {
    path: '/admins',
    name: 'Admins',
    component: Admins,
    meta: {
      role: 99
    }
  }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requireRole = to.matched.find(record => record.meta.role != null)
  let userRole = store.state.users.user.role

  if (!currentUser && requireRole != null) {
    next('login')
  } else {
    if (requireRole != null && userRole < requireRole.meta.role) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
