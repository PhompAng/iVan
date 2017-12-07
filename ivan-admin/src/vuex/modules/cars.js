import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const state = {
  cars: {}
}

const getters = {
  [getter.GET_CARS]: state => {
    if (!state.cars) {
      return []
    }
    let arr = []
    Object.entries(state.cars).forEach(([key, val]) => {
      let car = JSON.parse(JSON.stringify(val))
      car['id'] = key
      car['text'] = car.plate_number
      if (car.time == null) {
        car['time'] = {
          morning: {
            start: {
              HH: '',
              mm: ''
            },
            end: {
              HH: '',
              mm: ''
            }
          },
          evening: {
            start: {
              HH: '',
              mm: ''
            },
            end: {
              HH: '',
              mm: ''
            }
          }
        }
      }
      arr.push(car)
    })
    return arr
  },
  [getter.GET_CAR]: state => arg => {
    return state.cars[arg]
  }
}

const actions = {
  [action.CREATE_CAR] ({commit}, form) {
    return new Promise((resolve, reject) => {
      let ref = firebase.database().ref().child('cars/').push(form)
      ref.then(() => {
        if (form.file != null) {
          firebase.storage().ref().child('cars/' + ref.key).put(form.file)
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
  [action.UPDATE_CAR] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child('cars/' + form.id).set(form)
      .then(() => {
        if (form.file != null) {
          firebase.storage().ref().child('cars/' + form.id).put(form.file)
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
  [action.FETCH_CAR] ({commit}, schoolId) {
    firebase.database().ref().child('cars')
    .orderByChild('school')
    .equalTo(schoolId)
    .on('value', function (snapshot) {
      commit(mutation.SET_CAR, snapshot.val())
    })
  },
  [action.DELETE_CAR] ({commit}, form) {
    firebase.database().ref().child('cars/' + form.id).remove()
    firebase.storage().ref().child('cars/' + form.id).delete()
  },
  [action.ASSIGN_DRIVER] ({commit}, form) {
    let carId = form.carId
    let selected = form.selected
    firebase.database().ref().child('drivers')
    .orderByChild('car')
    .equalTo(carId)
    .once('value')
    .then((snapshot) => {
      snapshot.forEach((child) => {
        child.ref.child('car').set(null)
      })
      firebase.database().ref().child('cars/' + carId).child('drivers')
      .set(selected)
      let update = {}
      selected.forEach((driver) => {
        update['drivers/' + driver.id + '/car'] = carId
      })
      firebase.database().ref().update(update)
    })
  },
  [action.ASSIGN_TEACHER] ({commit}, form) {
    let carId = form.carId
    let selected = form.selected
    firebase.database().ref().child('teachers')
    .orderByChild('car')
    .equalTo(carId)
    .once('value')
    .then((snapshot) => {
      snapshot.forEach((child) => {
        child.ref.child('car').set(null)
      })
      firebase.database().ref().child('cars/' + carId).child('teachers')
      .set(selected)
      let update = {}
      selected.forEach((teacher) => {
        update['teachers/' + teacher.id + '/car'] = carId
      })
      firebase.database().ref().update(update)
    })
  },
  [action.ASSIGN_STUDENT] ({commit}, form) {
    let carId = form.carId
    let selected = form.selected
    firebase.database().ref().child('students')
    .orderByChild('car')
    .equalTo(carId)
    .once('value')
    .then((snapshot) => {
      snapshot.forEach((child) => {
        child.ref.child('car').set(null)
      })
      firebase.database().ref().child('cars/' + carId).child('students')
      .set(selected)
      let update = {}
      selected.forEach((student) => {
        update['students/' + student.id + '/car'] = carId
      })
      firebase.database().ref().update(update)
    })
  }
}

const mutations = {
  [mutation.SET_CAR] (state, snapshot) {
    state.cars = JSON.parse(JSON.stringify(snapshot))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
