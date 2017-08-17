import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const state = {
  admins: {}
}

const getters = {
  [getter.GET_ADMINS]: state => {
    if (!state.admins) {
      return []
    }
    let arr = []
    Object.entries(state.admins).forEach(([key, val]) => {
      let admin = JSON.parse(JSON.stringify(val))
      admin['id'] = key
      arr.push(admin)
    })
    return arr
  },
  [getter.GET_SCHOOL_ADMINS]: state => school => {
    if (!state.admins) {
      return []
    }
    let arr = []
    Object.entries(state.admins).forEach(([key, val]) => {
      let admin = JSON.parse(JSON.stringify(val))
      if (admin.school === school) {
        admin['id'] = key
        arr.push(admin)
      }
    })
    return arr
  }
}

const actions = {
  [action.CREATE_ADMIN] ({commit}, form) {
    firebase.auth().createUserWithEmailAndPassword(form.email, form.password).then((user) => {
      firebase.database().ref().child('users/' + user.uid).set({
        role: 75
      })
      delete form.password
      firebase.database().ref().child('admins/' + user.uid).set(form)
      firebase.storage().ref().child('admins/' + user.uid).put(form.file)
    })
  },
  [action.UPDATE_ADMIN] ({commit}, form) {
    let user = firebase.auth().currentUser
    user.updateEmail(form.email)
    user.updatePassword(form.password)
    delete form.password
    firebase.database().ref().child('admins/' + user.uid).set(form)
    firebase.storage().ref().child('admins/' + user.uid).put(form.file)
  },
  [action.FETCH_ADMIN] ({commit}) {
    firebase.database().ref('/admins').on('value', function (snapshot) {
      commit(mutation.FETCH_ADMIN, snapshot.val())
    })
  },
  [action.DELETE_ADMIN] ({commit}, form) {
    firebase.database().ref().child('admins/' + form.id).remove()
    firebase.database().ref().child('users/' + form.id).remove()
  }
}

const mutations = {
  [mutation.FETCH_ADMIN] (state, snapshot) {
    state.admins = JSON.parse(JSON.stringify(snapshot))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
