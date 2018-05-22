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
    return new Promise((resolve, reject) => {
      firebase.auth()
      .signInWithEmailAndPassword(form.email, form.password)
      .then((user) => {
        firebase.database().ref().child('users/' + user.uid).once('value')
        .then((snapshot) => {
          let role = (snapshot.val() && snapshot.val().role) || 0
          user.role = role
          if (role < 99) {
            let school = (snapshot.val() && snapshot.val().school) || ''
            user.school = school
          }
          commit(mutation.SET_USER, user)
          resolve(user)
        })
      })
      .catch((error) => {
        console.log(error.message)
        reject(error)
      })
    })
  },
  [action.SIGNOUT] ({commit}) {
    return new Promise((resolve, reject) => {
      firebase.auth()
      .signOut()
      .then(() => {
        commit(mutation.SET_USER, null)
        resolve()
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }
}

const mutations = {
  [mutation.SET_USER] (state, user) {
    if (user) {
      console.log(user)
      state.user = JSON.parse(JSON.stringify(user))
      state.user.role = user.role
      state.user.school = user.school
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
