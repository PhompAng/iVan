import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const emptyTime = {
  HH: '',
  mm: ''
}

const emptyStartEnd = {
  start: emptyTime,
  end: emptyTime
}

const emptyWorkingHour = {
  morning: emptyStartEnd,
  evening: emptyStartEnd
}

const updatePhoto = (key, form) => {
  return new Promise((resolve, reject) => {
    if (form.file != null) {
      firebase.storage().ref().child('cars/' + form.id).put(form.file)
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
  cars: {},
  mobility_status: {},
  maintenance: {}
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
      car['value'] = key
      if (car.time == null) {
        car['time'] = emptyWorkingHour
      }
      arr.push(car)
    })
    return arr
  },
  [getter.GET_CAR]: state => arg => {
    return state.cars[arg]
  },
  [getter.GET_MAINTENANCE]: state => {
    return state.maintenance
  },
  [getter.GET_MOBILITY_STATUS]: state => {
    if (!state.mobility_status) {
      return []
    }
    let obj = {}
    Object.entries(state.mobility_status).forEach(([key, val]) => {
      let arr = []
      Object.entries(val).forEach(([key, val]) => {
        arr.push(JSON.parse(JSON.stringify(val)))
      })
      obj[key] = arr
    })
    return obj
  }
}

const actions = {
  [action.CREATE_CAR] ({commit}, form) {
    return new Promise((resolve, reject) => {
      let key = firebase.database().ref().child('cars/').push().key
      form.id = key
      firebase.database().ref().child('cars/' + key).set(form)
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
  [action.UPDATE_CAR] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child('cars/' + form.id).set(form)
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
    selected.forEach((driver) => {
      driver.car = carId
    })
    return new Promise((resolve, reject) => {
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
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
    })
  },
  [action.ASSIGN_TEACHER] ({commit}, form) {
    let carId = form.carId
    let selected = form.selected
    selected.forEach((teacher) => {
      teacher.car = carId
    })
    return new Promise((resolve, reject) => {
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
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
    })
  },
  [action.ASSIGN_STUDENT] ({commit}, form) {
    let carId = form.carId
    let selected = form.selected
    selected.forEach((student) => {
      student.car = carId
    })
    return new Promise((resolve, reject) => {
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
        update['cars/' + carId + '/route'] = null
        firebase.database().ref().update(update)
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
    })
  },
  [action.SET_ROUTE] ({commit}, form) {
    let carId = form.carId
    let time = form.time
    let routes = form.routes
    let waypoints = form.waypoints
    firebase.database().ref().child('cars/' + carId).child('route').child(time).set({
      routes: routes,
      waypoints: waypoints
    })
  },
  [action.FETCH_MOBILITY_STATUS] ({commit}, schoolId) {
    firebase.database().ref().child('mobility_status')
    .child(schoolId)
    .on('value', function (snapshot) {
      commit(mutation.SET_MOBILITY_STATUS, snapshot.val())
    })
  },
  [action.PUSH_MAINTENANCE] ({commit}, form) {
    return firebase.database().ref().child('maintenance').child(form.carId).push(form)
  },
  [action.FETCH_MAINTENANCE] ({commit}, carId) {
    firebase.database().ref('maintenance/')
    .child(carId)
    .orderByKey()
    .limitToLast(1)
    .once('value')
    .then((snapshot) => {
      snapshot.forEach((child) => {
        commit(mutation.SET_MAINTENANCE, child.val())
      })
    })
  }
}

const mutations = {
  [mutation.SET_CAR] (state, snapshot) {
    state.cars = JSON.parse(JSON.stringify(snapshot))
  },
  [mutation.SET_MOBILITY_STATUS] (state, snapshot) {
    state.mobility_status = JSON.parse(JSON.stringify(snapshot))
  },
  [mutation.SET_MAINTENANCE] (state, snapshot) {
    state.maintenance = JSON.parse(JSON.stringify(snapshot))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
