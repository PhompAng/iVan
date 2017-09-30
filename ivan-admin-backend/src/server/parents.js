import * as admin from 'firebase-admin'

export default (app) => {
  app.delete('/parents', async function (req, res) {
    try {
      await Promise.all([
        admin.auth().deleteUser(req.body.uid),
        admin.database().ref().child('parents/' + req.body.uid).remove(),
        admin.database().ref().child('users/' + req.body.uid).remove(),
        admin.storage().bucket().file('parents/' + req.body.uid).delete()
      ])
      res.send('Success')
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  })
}
