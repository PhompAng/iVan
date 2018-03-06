import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const state = {
  devices: {}
}

const getters = {
  [getter.GET_DEVICES]: state => {
    if (!state.devices) {
      return []
    }
    let arr = []
    Object.entries(state.devices).forEach(([key, val]) => {
      let device = JSON.parse(JSON.stringify(val))
      device['id'] = key
      device['text'] = device.serial_number
      arr.push(device)
    })
    return arr
  }
}

const actions = {
  [action.CREATE_DEVICE] ({commit}, form) {
    return new Promise((resolve, reject) => {
      let key = firebase.database().ref().child('devices/').push().key
      form.id = key
      firebase.database().ref().child('devices/' + key).set(form)
      .then(() => {
        resolve()
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [action.UPDATE_DEVICE] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child('devices/' + form.id).set(form)
      .then(() => {
        resolve()
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [action.FETCH_DEVICE] ({commit}, schoolId) {
    firebase.database().ref().child('devices')
    .orderByChild('school')
    .equalTo(schoolId)
    .on('value', function (snapshot) {
      commit(mutation.SET_DEVICE, snapshot.val())
    })
  },
  [action.DELETE_DEVICE] ({commit}, form) {
    firebase.database().ref().child('devices/' + form.id).remove()
  },
  [action.ASSIGN_SENSOR] ({commit}, form) {
    let deviceId = form.deviceId
    let selected = form.selected
    selected.forEach((sensor) => {
      sensor.car = deviceId
    })
    return new Promise((resolve, reject) => {
      firebase.database().ref().child('sensors')
      .orderByChild('device')
      .equalTo(deviceId)
      .once('value')
      .then((snapshot) => {
        snapshot.forEach((child) => {
          child.ref.child('device').set(null)
        })
        firebase.database().ref().child('devices/' + deviceId).child('sensors')
        .set(selected)
        let update = {}
        selected.forEach((sensor) => {
          update['sensors/' + sensor.id + '/device'] = deviceId
        })
        firebase.database().ref().update(update)
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
    })
  }
}

const mutations = {
  [mutation.SET_DEVICE] (state, snapshot) {
    state.devices = JSON.parse(JSON.stringify(snapshot))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
