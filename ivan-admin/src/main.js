// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import store from '@/vuex/store'
import * as firebase from 'firebase'
import * as VueGoogleMaps from 'vue2-google-maps'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@/assets/simple-sidebar.css'
import '@/assets/style.css'

var config = {
  apiKey: 'AIzaSyAMAqh5zXFpqgnlonv9uzfgujqdS4E1JPs',
  authDomain: 'ivan-f1006.firebaseapp.com',
  databaseURL: 'https://ivan-f1006.firebaseio.com',
  storageBucket: 'gs://ivan-f1006.appspot.com/'
}

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAIjHegp8MadL2W-nCbQPuKLZu5QjDRBnI',
    libraries: 'places'
  }
})

let app
firebase.initializeApp(config)
firebase.auth().onAuthStateChanged((user) => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: {
        App
      }
    })
  }
})
