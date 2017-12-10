import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Hello from '@/components/Hello'
import Login from '@/components/auth/Login'
import Schools from '@/components/school/Schools'
import ViewSchool from '@/components/school/ViewSchool'
import ViewDriver from '@/components/driver/ViewDriver'
import ViewCar from '@/components/car/ViewCar'
import store from '../vuex/store'
import * as firebase from 'firebase'
import Admins from '@/components/admin/Admins'
import Teachers from '@/components/teacher/Teachers'
import Drivers from '@/components/driver/Drivers'
import Parents from '@/components/parent/Parents'
import Students from '@/components/student/Students'
import CarAssign from '@/components/car/assign/CarAssign'
import Cars from '@/components/car/Cars'
import Sensors from '@/components/sensor/Sensors'
import Devices from '@/components/device/Devices'
import DeviceAssign from '@/components/device/assign/DeviceAssign'
import Notifications from '@/components/Notifications'

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
      role: [99, 75, 60]
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
      role: [99]
    }
  },
  {
    path: '/schools/:id',
    name: 'ViewSchool',
    component: ViewSchool,
    meta: {
      role: [99]
    }
  },
  {
    path: '/admins',
    name: 'Admins',
    component: Admins,
    meta: {
      role: [99, 75]
    }
  },
  {
    path: '/teachers',
    name: 'Teachers',
    component: Teachers,
    meta: {
      role: [99, 75, 60]
    }
  },
  {
    path: '/drivers',
    name: 'Drivers',
    component: Drivers,
    meta: {
      role: [99, 75, 60]
    }
  },
  {
    path: '/drivers/:id',
    name: 'ViewDriver',
    component: ViewDriver,
    meta: {
      role: [99, 75, 60]
    }
  },
  {
    path: '/parents',
    name: 'Parents',
    component: Parents,
    meta: {
      role: [99, 75, 60]
    }
  },
  {
    path: '/students',
    name: 'Students',
    component: Students,
    meta: {
      role: [99, 75, 60]
    }
  },
  {
    path: '/cars',
    name: 'Cars',
    component: Cars,
    meta: {
      role: [99, 75, 60]
    }
  },
  {
    path: '/cars/:id',
    name: 'ViewCar',
    component: ViewCar,
    meta: {
      role: [99, 75]
    }
  },
  {
    path: '/cars/:id/assign',
    name: 'CarAssign',
    component: CarAssign,
    meta: {
      role: [99, 75]
    }
  },
  {
    path: '/sensors',
    name: 'Sensors',
    component: Sensors,
    meta: {
      role: [99, 75, 60]
    }
  },
  {
    path: '/devices',
    name: 'Devices',
    component: Devices,
    meta: {
      role: [99, 75, 60]
    }
  },
  {
    path: '/devices/:id/assign',
    name: 'DeviceAssign',
    component: DeviceAssign,
    meta: {
      role: [99, 75]
    }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications,
    meta: {
      role: [99, 75]
    }
  }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requireRole = to.matched.find(record => record.meta.role != null)
  let userRole = store.state.users.user.role

  if (!currentUser && requireRole != null) {
    next('/login')
  } else {
    if (requireRole != null && requireRole.meta.role.indexOf(userRole) === -1 || userRole < 60) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
