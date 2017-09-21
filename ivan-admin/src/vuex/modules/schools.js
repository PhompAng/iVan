import * as getter from '@/vuex/getter-types'
import * as mutation from '@/vuex/mutation-types'
import * as action from '@/vuex/action-types'
import * as firebase from 'firebase'

const state = {
  schools: {}
}

const getters = {
  [getter.GET_SCHOOLS]: state => {
    if (!state.schools) {
      return []
    }
    let arr = []
    Object.entries(state.schools).forEach(([key, val]) => {
      let school = JSON.parse(JSON.stringify(val))
      school['id'] = key
      arr.push(school)
    })
    return arr
  },
  [getter.GET_SCHOOL]: state => arg => {
    return state.schools[arg]
  },
  [getter.GET_SCHOOL_SELECT]: state => {
    if (!state.schools) {
      return []
    }
    let arr = []
    Object.entries(state.schools).forEach(([key, val]) => {
      let school = []
      school['text'] = val.name.th
      school['value'] = key
      arr.push(school)
    })
    return arr
  }
}

const actions = {
  [action.CREATE_SCHOOL] ({commit}, form) {
    return new Promise((resolve, reject) => {
      let ref = firebase.database().ref().child('schools/').push(form)
      ref.then(() => {
        firebase.storage().ref().child('schools/' + ref.key).put(form.file)
        .then((snapshot) => {
          resolve(snapshot)
        })
      })
      .catch((error) => {
        console.log(error.message)
        reject(error)
      })
    })
  },
  [action.UPDATE_SCHOOL] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child('schools/' + form.id).set(form)
      .then(() => {
        if (form.file != null) {
          firebase.storage().ref().child('schools/' + form.id).put(form.file)
          .then((snapshot) => {
            resolve(snapshot)
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
  [action.DELETE_SCHOOL] ({commit}, form) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child('schools/' + form.id).remove()
      .then(() => {
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
    })
  },
  [action.FETCH_SCHOOL] ({commit}) {
    firebase.database().ref('/schools').on('value', function (snapshot) {
      commit(mutation.FETCH_SCHOOL, snapshot.val())
    })
  }
}

const mutations = {
  [mutation.FETCH_SCHOOL] (state, snapshot) {
    state.schools = JSON.parse(JSON.stringify(snapshot))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
