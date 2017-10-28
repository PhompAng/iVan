import * as admin from 'firebase-admin'

export default (app) => {
  app.post('/status', async function (req, res) {
    try {
      var carId = req.body.car_id

      var status = req.body.mobility_status
      delete status.timestamp
      status.timestamp = admin.database.ServerValue.TIMESTAMP
      var result = await admin.database().ref().child('cars/' + carId).child('mobility_status').push(status)

      res.send(result)
    } catch (err) {
      console.log('Error:', err)
      res.send(err)
    }
  })
}
