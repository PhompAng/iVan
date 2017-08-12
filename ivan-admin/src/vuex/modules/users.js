import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const state = {
  user: {}
}

const getters = {
  [getter.GET_USER]: state => state.user
}

const actions = {
  [action.SIGNIN] ({commit}, form) {
    firebase.auth()
      .signInWithEmailAndPassword(form.email, form.password)
      .then((user) => {
        commit(mutation.SET_USER, user)
      })
      .catch((error) => {
        console.log(error.message)
      })
  },
  [action.SIGNOUT] ({commit}) {
    firebase.auth()
      .signOut()
      .then(() => {
        commit(mutation.SET_USER, null)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

const mutations = {
  [mutation.SET_USER] (state, user) {
    if (user) {
      state.user.uid = user.uid
      state.user.displayName = user.displayName
    } else {
      state.user = {}
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
