import Vue from 'vue'
import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const state = {
  students: {}
}

const getters = {
  [getter.GET_STUDENTS]: state => {
    if (!state.students) {
      return []
    }
    let arr = []
    Object.entries(state.students).forEach(([key, val]) => {
      let student = JSON.parse(JSON.stringify(val))
      student['id'] = key
      arr.push(student)
    })
    return arr
  }
}

const actions = {
  [action.CREATE_STUDENT] ({commit}, form) {
    return new Promise((resolve, reject) => {
      let ref = firebase.database().ref().child('students/').push(form)
      ref.then(() => {
        if (form.file != null) {
          firebase.storage().ref().child('students/' + ref.key).put(form.file)
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
  [action.UPDATE_STUDENT] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child('students/' + form.id).set(form)
      .then(() => {
        if (form.file != null) {
          firebase.storage().ref().child('students/' + form.id).put(form.file)
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
  [action.FETCH_STUDENT] ({commit}, schoolId) {
    firebase.database().ref().child('students')
    .orderByChild('school')
    .equalTo(schoolId)
    .on('value', function (snapshot) {
      commit(mutation.SET_STUDENT, snapshot.val())
    })
  },
  [action.DELETE_STUDENT] ({commit}, form) {
    Vue.http.delete('students', {body: {uid: form.id}})
  }
}

const mutations = {
  [mutation.SET_STUDENT] (state, snapshot) {
    state.students = JSON.parse(JSON.stringify(snapshot))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
