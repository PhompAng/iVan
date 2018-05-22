import * as admin from 'firebase-admin'

function getDeleteNotification (childs, uid) {
  return new Promise((resolve, reject) => {
    admin.database().ref().child('notifications').once('value')
    .then((snapshot) => {
      let notifications = snapshot.val()
      Object.entries(notifications).forEach(([userId, values]) => {
        Object.entries(values).forEach(([key, val]) => {
          if (val.uid === uid) {
            childs['notifications/' + userId + '/' + key] = null
          }
        })
      })
      resolve()
    })
    .catch((error) => {
      reject(error)
    })
  })
}

function getDeleteAlarmStatus (childs, uid) {
  return new Promise((resolve, reject) => {
    admin.database().ref().child('alarm_status').once('value')
    .then((snapshot) => {
      let alarmStatuses = snapshot.val()
      Object.entries(alarmStatuses).forEach(([userId, values]) => {
        Object.entries(values).forEach(([key, val]) => {
          if (val.uid === uid) {
            childs['alarm_status/' + userId + '/' + key] = null
          }
        })
      })
      resolve()
    })
    .catch((error) => {
      reject(error)
    })
  })
}

async function getDeleteChilds (uid) {
  let childs = {}
  try {
    return getDeleteAlarmStatus(childs, uid)
    .then(() => {
      return getDeleteNotification(childs, uid)
    })
    .then(() => {
      return childs
    })
  } catch (err) {
    return {}
  }
}

async function getUpdateChilds (uid) {
  let alarmStatusRef = admin.database().ref().child('alarm_status')
  let childs = {}
  try {
    return alarmStatusRef
    .once('value')
    .then((snapshot) => {
      let alarmStatuses = snapshot.val()
      Object.entries(alarmStatuses).forEach(([userId, values]) => {
        Object.entries(values).forEach(([key, val]) => {
          if (val.uid === uid) {
            childs[userId + '/' + key + '/isReportFalse'] = true
          }
        })
      })
      return childs
    })
  } catch (err) {
    return {}
  }
}

export default (app) => {
  app.post('/report_false', async function (req, res) {
    try {
      let uid = req.body.uid
      let alarmStatusRef = admin.database().ref().child('alarm_status')
      let alarmStatusDataRef = admin.database().ref().child('alarm_status_data')
      await alarmStatusDataRef.child(uid).child('isReportFalse').set(true)
      let childs = await getUpdateChilds(uid)
      await alarmStatusRef.update(childs)
      res.json('Success')
    } catch (err) {
      console.log(err)
      res.status(400).json(err)
    }
  })
  app.post('/delete_alarm', async function (req, res) {
    try {
      let uid = req.body.uid
      console.log(req.body)
      let databaseRef = admin.database().ref()
      let alarmStatusDataRef = admin.database().ref().child('alarm_status_data')
      await alarmStatusDataRef.child(uid).set(null)
      let childs = await getDeleteChilds(uid)
      console.log(childs)
      await databaseRef.update(childs)
      res.json('Success')
    } catch (err) {
      console.log(err)
      res.status(400).json(err)
    }
  })
}
