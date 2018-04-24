import * as admin from 'firebase-admin'

async function getUpdateChilds (uid, data) {
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
            childs[userId + '/' + key + '/confirm'] = data
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
  app.post('/confirm', async function (req, res) {
    try {
      let uid = req.body.uid
      let confirmData = req.body.data
      confirmData.timestamp = admin.database.ServerValue.TIMESTAMP
      let alarmStatusRef = admin.database().ref().child('alarm_status')
      let alarmStatusDataRef = admin.database().ref().child('alarm_status_data')
      await alarmStatusDataRef.child(uid).child('confirm').set(confirmData)
      let childs = await getUpdateChilds(uid, confirmData)
      await alarmStatusRef.update(childs)
      res.json('Success')
    } catch (err) {
      console.log(err)
      res.status(400).json(err)
    }
  })
}
