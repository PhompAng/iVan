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
      firebase.database().ref('/parents/' + form.parent).once('value').then(function (snapshot) {
        form.text = form.name.th_first + ' ' + form.name.th_last
        form.location = snapshot.val().location
        form.address = snapshot.val().address
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
    })
  },
  [action.UPDATE_STUDENT] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/parents/' + form.parent).once('value').then(function (snapshot) {
        form.text = form.name.th_first + ' ' + form.name.th_last
        form.location = snapshot.val().location
        form.address = snapshot.val().address
        firebase.database().ref().child('students/' + form.id).set(form)
        .then(() => {
          new Promise((resolve, reject) => {
            if (form.hasOwnProperty('car')) {
              firebase.database().ref('/cars/' + form.car + '/students').once('value')
              .then(function (snapshot2) {
                const students = snapshot2.val()
                for (const i in students) {
                  if (students[i].id === form.id) {
                    firebase.database().ref().child('/cars/' + form.car + '/students/' + i).set(form)
                    break
                  }
                }
              })
            }
            resolve()
          })
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
