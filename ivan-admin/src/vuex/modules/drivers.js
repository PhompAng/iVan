import Vue from 'vue'
import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const updateDriverInCar = (form) => {
  return new Promise((resolve, reject) => {
    if (form.hasOwnProperty('car')) {
      firebase.database().ref('/cars/' + form.car + '/drivers').once('value').then(function (snapshot) {
        const drivers = snapshot.val()
        for (const i in drivers) {
          if (drivers[i].id === form.id) {
            firebase.database().ref().child('/cars/' + form.car + '/drivers/' + i).set(form)
            resolve()
            return
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
      firebase.storage().ref().child('drivers/' + form.id).put(form.file)
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
        form.id = user.uid
        return firebase.database().ref().child('drivers/' + user.uid).set(form)
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
  [action.UPDATE_DRIVER] ({commit}, form) {
    return new Promise((resolve, reject) => {
      form.text = form.name.th_first + ' ' + form.name.th_last
      firebase.database().ref().child('drivers/' + form.id).set(form)
      .then(() => {
        return updateDriverInCar(form)
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
  [action.FETCH_DRIVER] ({commit}, schoolId) {
    firebase.database().ref().child('drivers')
    .orderByChild('school')
    .equalTo(schoolId)
    .on('value', function (snapshot) {
      commit(mutation.SET_DRIVER, snapshot.val())
    })
  },
  [action.DELETE_DRIVER] ({commit}, form) {
    Vue.http.delete('drivers', {
      body: {
        uid: form.id,
        carId: form.car
      }
    })
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
