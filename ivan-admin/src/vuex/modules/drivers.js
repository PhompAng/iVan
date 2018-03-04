import Vue from 'vue'
import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const state = {
  drivers: {}
}

const getters = {
  [getter.GET_DRIVERS]: state => {
    if (!state.drivers) {
      return []
    }
    let arr = []
    Object.entries(state.drivers).forEach(([key, val]) => {
      let driver = JSON.parse(JSON.stringify(val))
      driver['id'] = key
      driver['text'] = driver.name.th_first + ' ' + driver.name.th_last
      arr.push(driver)
    })
    return arr
  },
  [getter.GET_DRIVER]: state => arg => {
    return state.drivers[arg]
  }
}

const actions = {
  [action.CREATE_DRIVER] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(form.email, form.password).then((user) => {
        user.updateProfile({
          displayName: form.name.en_first + ' ' + form.name.en_last
        })
        firebase.database().ref().child('users/' + user.uid).set({
          role: 50,
          school: form.school
        })
        delete form.password
        firebase.database().ref().child('drivers/' + user.uid).set(form)
        if (form.file != null) {
          firebase.storage().ref().child('drivers/' + user.uid).put(form.file)
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
  [action.UPDATE_DRIVER] ({commit}, form) {
    return new Promise((resolve, reject) => {
      form.text = form.name.th_first + ' ' + form.name.th_last
      firebase.database().ref().child('drivers/' + form.id).set(form)
      .then(() => {
        if (form.file != null) {
          firebase.storage().ref().child('drivers/' + form.id).put(form.file)
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
      if (form.hasOwnProperty('car')) {
        firebase.database().ref('/cars/' + form.car + '/drivers').once('value').then(function (snapshot2) {
          const drivers = snapshot2.val()
          for (const i in drivers) {
            if (drivers[i].id === form.id) {
              firebase.database().ref().child('/cars/' + form.car + '/drivers/' + i).set(form)
              break
            }
          }
        })
      }
    })
  },
  [action.FETCH_DRIVER] ({commit}, schoolId) {
    firebase.database().ref().child('drivers')
    .orderByChild('school')
    .equalTo(schoolId)
    .on('value', function (snapshot) {
      commit(mutation.SET_DRIVER, snapshot.val())
    })
  },
  [action.DELETE_DRIVER] ({commit}, form) {
    Vue.http.delete('drivers', {body: {uid: form.id}})
  }
}

const mutations = {
  [mutation.SET_DRIVER] (state, snapshot) {
    state.drivers = JSON.parse(JSON.stringify(snapshot))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
