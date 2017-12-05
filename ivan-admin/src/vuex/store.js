import Vue from 'vue'
import Vuex from 'vuex'
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

}
const actions = {

}
const getters = {

}
const mutations = {

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
