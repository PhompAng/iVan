import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const state = {
  sensors: {}
}

const getters = {
  [getter.GET_SENSORS]: state => {
    if (!state.sensors) {
      return []
    }
    let arr = []
    Object.entries(state.sensors).forEach(([key, val]) => {
      let sensor = JSON.parse(JSON.stringify(val))
      sensor['id'] = key
      sensor['text'] = sensor.serial_number
      arr.push(sensor)
    })
    return arr
  },
  [getter.GET_SENSOR]: state => arg => {
    return state.sensors[arg]
  },
  [getter.GET_SENSORS_DEVICE]: state => arg => {
    if (!state.sensors) {
      return []
    }
    let arr = []
    Object.entries(state.sensors).forEach(([key, val]) => {
      let sensor = JSON.parse(JSON.stringify(val))
      sensor['id'] = key
      sensor['text'] = sensor.serial_number
      if (arg === sensor['device']) {
        arr.push(sensor)
      }
    })
    return arr
  }
}

const actions = {
  [action.CREATE_SENSOR] ({commit}, form) {
    return new Promise((resolve, reject) => {
      let key = firebase.database().ref().child('sensors/').push().key
      form.id = key
      firebase.database().ref().child('sensors/' + form.id).set(form)
      .then(() => {
        resolve()
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [action.UPDATE_SENSOR] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child('sensors/' + form.id).set(form)
      .then(() => {
        resolve()
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [action.FETCH_SENSOR] ({commit}, schoolId) {
    firebase.database().ref().child('sensors')
    .orderByChild('school')
    .equalTo(schoolId)
    .on('value', function (snapshot) {
      commit(mutation.SET_SENSOR, snapshot.val())
    })
  },
  [action.DELETE_SENSOR] ({commit}, form) {
    firebase.database().ref().child('sensors/' + form.id).remove()
  }
}

const mutations = {
  [mutation.SET_SENSOR] (state, snapshot) {
    state.sensors = JSON.parse(JSON.stringify(snapshot))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
