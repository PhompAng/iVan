import root from '~/server/root'
import admins from '~/server/admins'
import teachers from '~/server/teachers'
import students from '~/server/students'
import parents from '~/server/parents'
import drivers from '~/server/drivers'
import reportFalse from '~/server/reportFalse'
import detect from '~/server/iot/detect'
import confirm from '~/server/confirm'
import status from '~/server/iot/status'
import createQueueChannel from './channel'
import express from 'express'
import * as bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
var queue = process.env.AMQP_QUEUE || 'ivan-status'
console.log(queue)
var channel
var testChannel
app.use(cors())
app.use(bodyParser.json())

createQueueChannel(queue)
.then(ch => {
  channel = ch
  status(app, channel, queue)
})
.catch(error => console.log(error))

createQueueChannel('test')
.then(ch => {
  testChannel = ch
  root(app, testChannel, 'test')
})
.catch(error => console.log(error))

admins(app)
teachers(app)
students(app)
parents(app)
drivers(app)
detect(app)
confirm(app)
reportFalse(app)

export default app
