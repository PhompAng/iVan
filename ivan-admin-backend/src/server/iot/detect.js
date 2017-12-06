import * as admin from 'firebase-admin'

export default (app) => {
  app.post('/detect', async function (req, res) {
    try {
      var carId = req.body.car_id
      var detect = req.body.alarm_status
      detect.timestamp = admin.database.ServerValue.TIMESTAMP
      detect.data.forEach(d => {
        delete d.timestamp
        d.timestamp = admin.database.ServerValue.TIMESTAMP
      })
      // TODO push noti
      var drivers = admin.database().ref().child('drivers')
      .orderByChild('car')
      .equalTo(carId)
      .once('value')
      .then((snapshot) => {
        snapshot.forEach((child) => {
          child.ref.child('alarm_status').push(req.body.alarm_status)
        })
      })
      var teachers = admin.database().ref().child('teachers')
      .orderByChild('car')
      .equalTo(carId)
      .once('value')
      .then((snapshot) => {
        snapshot.forEach((child) => {
          child.ref.child('alarm_status').push(detect)
        })
      })

      var result = await Promise.all([
        drivers,
        teachers
      ])

      res.send(result)
    } catch (err) {
      console.log('Error:', err)
      res.send(err)
    }
  })
}