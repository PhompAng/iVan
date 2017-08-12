import Vue from 'vue'
import Vuex from 'vuex'
import users from './modules/users'

Vue.use(Vuex)

const state = {

}
const actions = {

}
const getters = {

}
const mutations = {

}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    users
  },
  strict: process.env.NODE_ENV !== 'production'
})
