import Vue from 'vue'
import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const state = {
  parents: {}
}

const getters = {
  [getter.GET_PARENTS]: state => {
    if (!state.parents) {
      return []
    }
    let arr = []
    Object.entries(state.parents).forEach(([key, val]) => {
      let parent = JSON.parse(JSON.stringify(val))
      parent['id'] = key
      parent['text'] = parent.name.th_first + ' ' + parent.name.th_last
      parent['value'] = key
      arr.push(parent)
    })
    return arr
  }
}

const actions = {
  [action.CREATE_PARENT] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(form.email, form.password).then((user) => {
        user.updateProfile({
          displayName: form.name.en_first + ' ' + form.name.en_last
        })
        firebase.database().ref().child('users/' + user.uid).set({
          role: 40,
          school: form.school
        })
        delete form.password
        firebase.database().ref().child('parents/' + user.uid).set(form)
        if (form.file != null) {
          firebase.storage().ref().child('parents/' + user.uid).put(form.file)
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
  [action.UPDATE_PARENT] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child('parents/' + form.id).set(form)
      .then(() => {
        if (form.file != null) {
          firebase.storage().ref().child('parents/' + form.id).put(form.file)
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
  [action.FETCH_PARENT] ({commit}, schoolId) {
    firebase.database().ref().child('parents')
    .orderByChild('school')
    .equalTo(schoolId)
    .on('value', function (snapshot) {
      commit(mutation.SET_PARENT, snapshot.val())
    })
  },
  [action.DELETE_PARENT] ({commit}, form) {
    Vue.http.delete('parents', {body: {uid: form.id}})
  }
}

const mutations = {
  [mutation.SET_PARENT] (state, snapshot) {
    state.parents = JSON.parse(JSON.stringify(snapshot))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
