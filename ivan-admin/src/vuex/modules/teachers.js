import Vue from 'vue'
import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const updateTeacherInCar = (form) => {
  return new Promise((resolve, reject) => {
    if (form.hasOwnProperty('car')) {
      firebase.database().ref('/cars/' + form.car + '/teachers').once('value').then(function (snapshot) {
        const teachers = snapshot.val()
        for (const i in teachers) {
          if (teachers[i].id === form.id) {
            form.text = form.name.th_first + ' ' + form.name.th_last
            firebase.database().ref().child('/cars/' + form.car + '/teachers/' + i).set(form)
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
      firebase.storage().ref().child('teachers/' + key).put(form.file)
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
  teachers: {},
  alarm_status: {}
}

const getters = {
  [getter.GET_TEACHERS]: state => {
    if (!state.teachers) {
      return []
    }
    let arr = []
    Object.entries(state.teachers).forEach(([key, val]) => {
      let teacher = JSON.parse(JSON.stringify(val))
      teacher['id'] = key
      arr.push(teacher)
    })
    return arr
  },
  [getter.GET_TEACHER]: state => arg => {
    return state.teachers[arg]
  },
  [getter.GET_TEACHER_ALARM_STATUS]: state => {
    if (!state.alarm_status) {
      return []
    }
    let arr = []
    Object.entries(state.alarm_status).forEach(([key, val]) => {
      let alarm = JSON.parse(JSON.stringify(val))
      alarm['id'] = key
      arr.push(alarm)
    })
    arr.reverse()
    return arr
  }
}

const actions = {
  [action.CREATE_TEACHER] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(form.email, form.password)
      .then((user) => {
        user.updateProfile({
          displayName: form.name.en_first + ' ' + form.name.en_last
        })
        firebase.database().ref().child('users/' + user.uid).set({
          role: 60,
          school: form.school
        })
        delete form.password
        form.id = user.uid
        return firebase.database().ref().child('teachers/' + user.uid).set(form)
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
  [action.UPDATE_TEACHER] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child('teachers/' + form.id).set(form)
      .then(() => {
        return updateTeacherInCar(form)
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
  [action.FETCH_TEACHER] ({commit}, schoolId) {
    firebase.database().ref().child('teachers')
    .orderByChild('school')
    .equalTo(schoolId)
    .on('value', function (snapshot) {
      commit(mutation.SET_TEACHER, snapshot.val())
    })
  },
  [action.DELETE_TEACHER] ({commit}, form) {
    Vue.http.delete('teachers', {
      body: {
        uid: form.id,
        carId: form.car
      }
    })
  },
  [action.FETCH_TEACHER_ALARM_STATUS] ({commit}, teacherId) {
    firebase.database().ref().child('alarm_status/' + teacherId)
    .orderByKey()
    .on('value', function (snapshot) {
      commit(mutation.SET_TEACHER_ALARM_STATUS, snapshot.val())
    })
  }
}

const mutations = {
  [mutation.SET_TEACHER] (state, snapshot) {
    state.teachers = JSON.parse(JSON.stringify(snapshot))
  },
  [mutation.SET_TEACHER_ALARM_STATUS] (state, snapshot) {
    state.alarm_status = JSON.parse(JSON.stringify(snapshot))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
