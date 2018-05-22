import _ from './env'
import 'babel-polyfill'
import * as admin from 'firebase-admin'
import createQueueChannel from './channel'
import mobilityStatus from './mobilityStatus'
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

mobilityStatus(queue)

createQueueChannel(testQueue)
.then(channel => {
  console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', testQueue)
  channel.consume(testQueue, (msg) => {
    console.log(' [x] Received %s: %s', testQueue, msg.content.toString())
  }, {noAck: true})
})
.catch(error => console.log(error))
