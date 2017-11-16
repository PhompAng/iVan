import * as admin from 'firebase-admin'

export default (app) => {
  app.delete('/drivers', async function (req, res) {
    try {
      await Promise.all([
        admin.auth().deleteUser(req.body.uid),
        admin.database().ref().child('drivers/' + req.body.uid).remove(),
        admin.database().ref().child('users/' + req.body.uid).remove(),
        admin.storage().bucket().file('drivers/' + req.body.uid).delete()
      ])
      res.send('Success')
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  })
}