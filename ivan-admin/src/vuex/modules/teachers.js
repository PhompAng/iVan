import Vue from 'vue'
import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const state = {
  teachers: {}
}

const getters = {
  [getter.GET_TEACHERS]: state => {
    if (!state.teachers) {
      return []
    }
    let arr = []
    Object.entries(state.teachers).forEach(([key, val]) => {
      let teacher = JSON.parse(JSON.stringify(val))
      teacher['id'] = key
      arr.push(teacher)
    })
    return arr
  }
}

const actions = {
  [action.CREATE_TEACHER] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(form.email, form.password).then((user) => {
        user.updateProfile({
          displayName: form.name.en_first + ' ' + form.name.en_last
        })
        firebase.database().ref().child('users/' + user.uid).set({
          role: 60,
          school: form.school
        })
        delete form.password
        firebase.database().ref().child('teachers/' + user.uid).set(form)
        if (form.file != null) {
          firebase.storage().ref().child('teachers/' + user.uid).put(form.file)
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
  [action.UPDATE_TEACHER] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child('teachers/' + form.id).set(form)
      .then(() => {
        if (form.file != null) {
          firebase.storage().ref().child('teachers/' + form.id).put(form.file)
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
  [action.FETCH_TEACHER] ({commit}, schoolId) {
    firebase.database().ref().child('teachers')
    .orderByChild('school')
    .equalTo(schoolId)
    .on('value', function (snapshot) {
      commit(mutation.SET_TEACHER, snapshot.val())
    })
  },
  [action.DELETE_TEACHER] ({commit}, form) {
    Vue.http.delete('teachers', {body: {uid: form.id}})
  }
}

const mutations = {
  [mutation.SET_TEACHER] (state, snapshot) {
    state.teachers = JSON.parse(JSON.stringify(snapshot))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
