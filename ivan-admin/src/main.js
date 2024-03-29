// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import store from '@/vuex/store'
import * as firebase from 'firebase'
import * as VueGoogleMaps from 'vue2-google-maps'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/bootstrap.scss'
import '@/assets/simple-sidebar.css'
import '@/assets/style.css'
import VueTimepicker from 'vue2-timepicker'
import VeeValidate from 'vee-validate'

var config = {
  apiKey: 'AIzaSyCRFqESXfz8hOGnmPwKRX5KfGqTQz-zRwY',
  authDomain: 'ivan-61013.firebaseapp.com',
  databaseURL: 'https://ivan-61013.firebaseio.com',
  storageBucket: 'gs://ivan-61013.appspot.com/'
}

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueTimepicker)
Vue.use(VeeValidate, {fieldsBagName: 'formFields'})
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCRFqESXfz8hOGnmPwKRX5KfGqTQz-zRwY',
    libraries: 'places, drawing'
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
