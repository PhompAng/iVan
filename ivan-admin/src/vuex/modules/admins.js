import Vue from 'vue'
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
  }
}

const actions = {
  [action.CREATE_ADMIN] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(form.email, form.password).then((user) => {
        user.updateProfile({
          displayName: form.name.en_first + ' ' + form.name.en_last
        })
        firebase.database().ref().child('users/' + user.uid).set({
          role: 75
        })
        delete form.password
        firebase.database().ref().child('admins/' + user.uid).set(form)
        if (form.file != null) {
          firebase.storage().ref().child('admins/' + user.uid).put(form.file)
          .then(() => {
            resolve()
          })
        } else {
          resolve()
        }
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [action.UPDATE_ADMIN] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child('admins/' + form.id).set(form)
      .then(() => {
        if (form.file != null) {
          firebase.storage().ref().child('admins/' + form.id).put(form.file)
          .then(() => {
            resolve()
          })
        } else {
          resolve()
        }
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [action.FETCH_ADMIN] ({commit}, schoolId) {
    firebase.database().ref().child('admins')
    .orderByChild('school')
    .equalTo(schoolId)
    .on('value', function (snapshot) {
      commit(mutation.FETCH_ADMIN, snapshot.val())
    })
  },
  [action.DELETE_ADMIN] ({commit}, form) {
    Vue.http.delete('admins', {body: {uid: form.id}})
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
