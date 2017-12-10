import * as admin from 'firebase-admin'
import { DateTime } from 'luxon'
import { getMorningTime, getEveningTime } from './workingHour'

function addStatusToDriver (carId, alarmStatus) {
  return admin.database().ref().child('drivers')
  .orderByChild('car')
  .equalTo(carId)
  .once('value')
  .then((snapshot) => {
    snapshot.forEach((child) => {
      child.ref.child('alarm_status').push(alarmStatus)
    })
  })
}

function addStatusToTeacher (carId, alarmStatus) {
  return admin.database().ref().child('teachers')
  .orderByChild('car')
  .equalTo(carId)
  .once('value')
  .then((snapshot) => {
    snapshot.forEach((child) => {
      child.ref.child('alarm_status').push(alarmStatus)
    })
  })
}

function addNotification (carId, alarmStatus) {
  return admin.database().ref().child('cars/' + carId)
  .once('value')
  .then((snapshot) => {
    let car = snapshot.val()
    let schoolId = car.school
    admin.database().ref().child('notifications/' + schoolId).push(
      {
        text: 'We detect sonething leftovered in car ' + car.plate_number,
        car: carId,
        timestamp: admin.database.ServerValue.TIMESTAMP,
        alarm_status: alarmStatus
      }
    )
  })
}

async function isInWorkingHour (carId, alarmStatus) {
  try {
    return admin.database().ref().child('cars/' + carId)
    .once('value')
    .then((snapshot) => {
      let car = snapshot.val()
      if (car.time != null) {
        let morningTime = getMorningTime(car)
        let eveningTime = getEveningTime(car)
        return morningTime.contains(DateTime.local()) || eveningTime.contains(DateTime.local())
      } else {
        return true
      }
    })
  } catch (err) {
    console.log(err)
    return false
  }
}

function isDetected (alarmStatus) {
  return alarmStatus.detection === 'DETECTED' || alarmStatus.detection === 'PARTIALLY_DETECTED'
}

export default (app) => {
  app.post('/detect', async function (req, res) {
    try {
      var carId = req.body.car_id
      var alarmStatus = req.body.alarm_status
      alarmStatus.timestamp = admin.database.ServerValue.TIMESTAMP
      alarmStatus.data.forEach(d => {
        delete d.timestamp
        d.timestamp = admin.database.ServerValue.TIMESTAMP
      })

      let isWorkingHour = await isInWorkingHour(carId)
      console.log(isWorkingHour)
      if (isWorkingHour && isDetected(alarmStatus)) {
        // TODO push noti
        var notification = addNotification(carId, alarmStatus)
        var drivers = addStatusToDriver(carId, alarmStatus)
        var teachers = addStatusToTeacher(carId, alarmStatus)

        var result = await Promise.all([
          notification,
          drivers,
          teachers
        ])

        res.send(result)
      } else {
        res.send()
      }
    } catch (err) {
      console.log('Error:', err)
      res.send(err)
    }
  })
}
