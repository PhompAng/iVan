import Vue from 'vue'
import Vuex from 'vuex'
import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'
import users from './modules/users'
import schools from './modules/schools'
import admins from './modules/admins'
import teachers from './modules/teachers'
import drivers from './modules/drivers'
import parents from './modules/parents'
import students from './modules/students'
import cars from './modules/cars'
import sensors from './modules/sensors'
import devices from './modules/devices'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
  notifications: {},
  alarmStatus: {}
}

const getters = {
  [getter.GET_NOTIFICATIONS]: state => {
    if (!state.notifications) {
      return []
    }
    let arr = []
    Object.entries(state.notifications).forEach(([key, val]) => {
      let notification = JSON.parse(JSON.stringify(val))
      notification['id'] = key
      arr.push(notification)
    })
    arr.reverse()
    return arr
  },
  [getter.GET_ALARM_STATUS]: state => {
    return state.alarmStatus
  }
}

const actions = {
  [action.FETCH_NOTIFICATION] ({commit}, schoolId) {
    firebase.database().ref().child('notifications/' + schoolId)
    .on('value', function (snapshot) {
      commit(mutation.SET_NOTIFICATION, snapshot.val())
    })
  },
  [action.FETCH_ALARM_STATUS] ({commit}, uid) {
    firebase.database().ref().child('alarm_status_data/' + uid)
    .once('value')
    .then((snapshot) => {
      commit(mutation.SET_ALARM_STATUS, snapshot.val())
    })
  },
  [action.DELETE_ALARM_STATUS] ({commit}, uid) {
    Vue.http.post('delete_alarm', {
      uid: uid
    })
  }
}

const mutations = {
  [mutation.SET_NOTIFICATION] (state, snapshot) {
    state.notifications = JSON.parse(JSON.stringify(snapshot))
  },
  [mutation.SET_ALARM_STATUS] (state, snapshot) {
    state.alarmStatus = JSON.parse(JSON.stringify(snapshot))
  }
}

/* eslint-disable no-undef */
export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    users,
    schools,
    admins,
    teachers,
    drivers,
    parents,
    students,
    cars,
    sensors,
    devices
  },
  plugins: [createPersistedState()],
  strict: process.env.NODE_ENV !== 'production'
})
