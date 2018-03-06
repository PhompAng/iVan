import * as admin from 'firebase-admin'

const updateDriverInCar = (carId, uid) => {
  return new Promise((resolve, reject) => {
    console.log(carId)
    if (carId != null) {
      admin.database().ref('/cars/' + carId + '/drivers').once('value').then(function (snapshot) {
        const drivers = snapshot.val()
        console.log(drivers)
        let newDrivers = drivers.filter(driver => driver.id !== uid)
        console.log(newDrivers)
        return admin.database().ref().child('/cars/' + carId + '/drivers/').set(newDrivers)
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
  app.delete('/drivers', async function (req, res) {
    try {
      await Promise.all([
        admin.auth().deleteUser(req.body.uid),
        admin.database().ref().child('drivers/' + req.body.uid).remove(),
        admin.database().ref().child('users/' + req.body.uid).remove(),
        admin.storage().bucket().file('drivers/' + req.body.uid).delete(),
        updateDriverInCar(req.body.carId, req.body.uid)
      ])
      res.send('Success')
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  })
}
