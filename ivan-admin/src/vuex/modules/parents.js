import Vue from 'vue'
import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const updatePhoto = (key, form) => {
  return new Promise((resolve, reject) => {
    if (form.file != null) {
      firebase.storage().ref().child('parents/' + form.id).put(form.file)
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

const updateStudentsLocation = (parentId, form) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref().child('students')
    .orderByChild('parent')
    .equalTo(parentId)
    .once('value')
    .then((snapshot) => {
      snapshot.forEach((child) => {
        firebase.database().ref().child('students/' + child.key).child('address').set(form.address)
        firebase.database().ref().child('students/' + child.key).child('location').set(form.location)
      })
      resolve()
    })
    .catch((error) => {
      reject(error)
    })
  })
}

const state = {
  parents: {}
}

const getters = {
  [getter.GET_PARENTS]: state => {
    if (!state.parents) {
      return []
    }
    let arr = []
    Object.entries(state.parents).forEach(([key, val]) => {
      let parent = JSON.parse(JSON.stringify(val))
      parent['id'] = key
      parent['text'] = parent.name.th_first + ' ' + parent.name.th_last
      parent['value'] = key
      arr.push(parent)
    })
    return arr
  },
  [getter.GET_PARENT]: state => arg => {
    return state.parents[arg]
  }
}

const actions = {
  [action.CREATE_PARENT] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(form.email, form.password)
      .then((user) => {
        user.updateProfile({
          displayName: form.name.en_first + ' ' + form.name.en_last
        })
        firebase.database().ref().child('users/' + user.uid).set({
          role: 40,
          school: form.school
        })
        delete form.password
        form.id = user.uid
        return firebase.database().ref().child('parents/' + user.uid).set(form)
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
  [action.UPDATE_PARENT] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child('parents/' + form.id).set(form)
      .then(() => {
        return updateStudentsLocation(form.id, form)
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
  [action.FETCH_PARENT] ({commit}, schoolId) {
    firebase.database().ref().child('parents')
    .orderByChild('school')
    .equalTo(schoolId)
    .on('value', function (snapshot) {
      commit(mutation.SET_PARENT, snapshot.val())
    })
  },
  [action.DELETE_PARENT] ({commit}, form) {
    Vue.http.delete('parents', {body: {uid: form.id}})
  }
}

const mutations = {
  [mutation.SET_PARENT] (state, snapshot) {
    state.parents = JSON.parse(JSON.stringify(snapshot))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
