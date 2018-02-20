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
    form.location = form.parent.location
    form.address = form.parent.address
    form.parent = form.parent.parent
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
      firebase.database().ref('/parents/' + form.parent).once('value').then(function (snapshot) {
        let student = JSON.parse(JSON.stringify(form))
        student.location = snapshot.val().location
        student.address = snapshot.val().address
        firebase.database().ref().child('students/' + form.id).set(student)
        .then(() => {
          if (form.file != null) {
            firebase.storage().ref().child('students/' + form.id).put(form.file)
            .then(() => {
              resolve()
            })
          } else {
            resolve()
          }
          if (student.hasOwnProperty('car')) {
            firebase.database().ref('/cars/' + student.car + '/students').once('value').then(function (snapshot2) {
              const students = snapshot2.val()
              for (const i in students) {
                if (students[i].id === student.id) {
                  student.text = student.name.th_first + ' ' + student.name.th_last
                  firebase.database().ref().child('/cars/' + student.car + '/students/' + i).set(student)
                  break
                }
              }
            })
          }
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
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
    firebase.database().ref().child('students/' + form.id).remove()
    firebase.storage().ref().child('students/' + form.id).delete()
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
