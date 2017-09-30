import Vue from 'vue'
import Vuex from 'vuex'
import users from './modules/users'
import schools from './modules/schools'
import admins from './modules/admins'
import teachers from './modules/teachers'
import parents from './modules/parents'
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
    parents
  },
  plugins: [createPersistedState()],
  strict: process.env.NODE_ENV !== 'production'
})
