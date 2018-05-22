import Vue from 'vue'
import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const updateStudentInCar = (form) => {
  return new Promise((resolve, reject) => {
    if (form.hasOwnProperty('car')) {
      firebase.database().ref('/cars/' + form.car + '/students').once('value')
      .then(function (snapshot) {
        const students = snapshot.val()
        for (const i in students) {
          if (students[i].id === form.id) {
            firebase.database().ref().child('/cars/' + form.car + '/students/' + i).set(form)
            resolve()
            break
          }
        }
      })
      .catch((error) => {
        reject(error)
      })
    } else {
      resolve()
    }
  })
}

const updatePhoto = (key, form) => {
  return new Promise((resolve, reject) => {
    if (form.file != null) {
      firebase.storage().ref().child('students/' + key).put(form.file)
      .then(() => {
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
    } else {
      resolve()
    }
  })
}

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
  },
  [getter.GET_STUDENT]: state => arg => {
    return state.students[arg]
  }
}

const actions = {
  [action.CREATE_STUDENT] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/parents/' + form.parent).once('value')
      .then(function (snapshot) {
        form.text = form.name.th_first + ' ' + form.name.th_last
        form.location = snapshot.val().location
        form.address = snapshot.val().address
        let key = firebase.database().ref().child('students/').push().key
        form.id = key
        return firebase.database().ref('/students/' + key).set(form)
      })
      .then(() => {
        return updatePhoto(form.id, form)
      })
      .then(() => {
        resolve()
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [action.UPDATE_STUDENT] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/parents/' + form.parent).once('value')
      .then(function (snapshot) {
        form.text = form.name.th_first + ' ' + form.name.th_last
        form.location = snapshot.val().location
        form.address = snapshot.val().address
        firebase.database().ref().child('students/' + form.id).set(form)
        .then(() => {
          return updateStudentInCar(form)
        })
        .then(() => {
          return updatePhoto(form.id, form)
        })
        .then(() => {
          resolve()
        })
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
    Vue.http.delete('students', {
      body: {
        uid: form.id,
        carId: form.car
      }
    })
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
