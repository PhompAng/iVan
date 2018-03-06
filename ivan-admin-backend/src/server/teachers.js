import * as admin from 'firebase-admin'

const updateTeacherInCar = (carId, uid) => {
  return new Promise((resolve, reject) => {
    if (carId != null) {
      admin.database().ref('/cars/' + carId + '/teachers').once('value').then(function (snapshot) {
        const teachers = snapshot.val()
        let newTeachers = teachers.filter(teacher => teacher.id !== uid)
        return admin.database().ref().child('/cars/' + carId + '/teachers/').set(newTeachers)
      })
      .then(() => {
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
    } else {
      resolve()
    }
  })
}

export default (app) => {
  app.delete('/teachers', async function (req, res) {
    try {
      await Promise.all([
        admin.auth().deleteUser(req.body.uid),
        admin.database().ref().child('teachers/' + req.body.uid).remove(),
        admin.database().ref().child('users/' + req.body.uid).remove(),
        admin.storage().bucket().file('teachers/' + req.body.uid).delete(),
        updateTeacherInCar(req.body.carId, req.body.uid)
      ])
      res.send('Success')
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  })
}
