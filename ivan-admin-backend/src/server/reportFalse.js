import * as admin from 'firebase-admin'

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
}
