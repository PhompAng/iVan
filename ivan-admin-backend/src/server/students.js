import * as admin from 'firebase-admin'

const updateStudentsInCar = (carId, uid) => {
  return new Promise((resolve, reject) => {
    if (carId != null) {
      admin.database().ref('/cars/' + carId + '/students').once('value').then(function (snapshot) {
        const students = snapshot.val()
        let newStudents = students.filter(student => student.id !== uid)
        return admin.database().ref().child('/cars/' + carId + '/students/').set(newStudents)
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
  app.delete('/students', async function (req, res) {
    try {
      await Promise.all([
        admin.database().ref().child('students/' + req.body.uid).remove(),
        admin.storage().bucket().file('students/' + req.body.uid).delete(),
        updateStudentsInCar(req.body.carId, req.body.uid)
      ])
      res.json('Success')
    } catch (err) {
      console.log(err)
      res.status(400).json(err)
    }
  })
}
