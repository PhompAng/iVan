import root from '~/server/root'
import express from 'express'
import * as bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
    console.log(req.body)
    next()
})

root(app)

export default app
