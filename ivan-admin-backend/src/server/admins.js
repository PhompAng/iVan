import * as admin from 'firebase-admin'

export default (app) => {
  app.delete('/admins', async function (req, res) {
    try {
      await Promise.all([
        admin.auth().deleteUser(req.body.uid),
        admin.database().ref().child('admins/' + req.body.uid).remove(),
        admin.database().ref().child('users/' + req.body.uid).remove(),
        admin.storage().bucket().file('admins/' + req.body.uid).delete()
      ])
      res.send('Success')
    } catch (err) {
      res.send(err)
    }
  })
}
