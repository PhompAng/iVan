import _ from './env'
import 'babel-polyfill'
import * as admin from 'firebase-admin'
import createQueueChannel from './channel'
import express from 'express'
var serviceAccount = require('~/resources/ivan-61013-firebase-adminsdk-nnum2-db72a74267')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ivan-61013.firebaseio.com',
  storageBucket: 'ivan-61013.appspot.com/'
})

const app = express()
app.listen(3001, function () {
  console.log('Example app listening on port 3000!')
})
app.get('/test', (req, res) => {
  res.sendStatus(200)
})

var queue = process.env.AMQP_QUEUE || 'ivan-status'
let testQueue = 'test'

createQueueChannel(queue)
.then(channel => {
  console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue)
  channel.consume(queue, async (msg) => {
    let req = JSON.parse(msg.content.toString())
    console.log(' [x] Received %s: %s', queue, msg.content.toString())
    try {
      var carId = req.car_id

      var status = req.mobility_status
      delete status.timestamp
      status.timestamp = admin.database.ServerValue.TIMESTAMP
      var result = await admin.database().ref().child('cars/' + carId).child('mobility_status').push(status)

      console.log(result)
    } catch (err) {
      console.error('Error: ', err)
    }
  }, {noAck: true})
})
.catch(error => console.log(error))

createQueueChannel(testQueue)
.then(channel => {
  console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', testQueue)
  channel.consume(testQueue, (msg) => {
    console.log(' [x] Received %s: %s', testQueue, msg.content.toString())
  }, {noAck: true})
})
.catch(error => console.log(error))
