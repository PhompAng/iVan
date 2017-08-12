// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import store from '@/vuex/store'
import * as firebase from 'firebase'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'

var config = {
  apiKey: 'AIzaSyAMAqh5zXFpqgnlonv9uzfgujqdS4E1JPs',
  authDomain: 'ivan-f1006.firebaseapp.com',
  databaseURL: 'https://ivan-f1006.firebaseio.com',
  storageBucket: 'ivan-f100.appspot.com'
}

Vue.config.productionTip = false

Vue.use(BootstrapVue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  created () {
    firebase.initializeApp(config)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.replace('/')
      } else {
        this.$router.replace('/login')
      }
    })
  },
  template: '<App/>',
  components: { App }
})
