import root from '~/server/root'
import admins from '~/server/admins'
import teachers from '~/server/teachers'
import parents from '~/server/parents'
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

export default app
