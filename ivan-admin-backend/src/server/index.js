import root from '~/server/root'
import admins from '~/server/admins'
import teachers from '~/server/teachers'
import parents from '~/server/parents'
import drivers from '~/server/drivers'
import detect from '~/server/iot/detect'
import status from '~/server/iot/status'
import express from 'express'
import * as bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(bodyParser.json())

root(app)
admins(app)
teachers(app)
parents(app)
drivers(app)
detect(app)
status(app)

export default app
