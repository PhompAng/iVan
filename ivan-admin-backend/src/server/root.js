import * as admin from 'firebase-admin'

export default (app, channel, queue) => {
  app.post('/', function (req, res) {
    console.log(req.body)
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(req.body)))
    res.send('Hello World!')
  })
  app.post('/gen', async function (req, res) {
    try {
      var userRecord = await admin.auth().createUser({
        email: req.body.email,
        emailVerified: false,
        password: req.body.password,
        displayName: req.body.displayName,
        disabled: false
      })
      var ref = admin.database().ref()
      var result = await ref.child('users').child(userRecord.uid).set({
        role: 99
      })

      res.send(result)
    } catch (err) {
      console.log('Error creating new user:', err)
      res.send(err)
    }
  })
  app.get('/test', (req, res) => {
    res.sendStatus(200)
  })
  app.post('/login', async function (req, res) {
    try {
      var decodedToken = await admin.auth().verifyIdToken(req.body.idToken)
      res.send(decodedToken.uid)
    } catch (err) {
      console.log(err)
    }
  })
}
