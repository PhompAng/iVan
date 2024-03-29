import * as admin from 'firebase-admin'
import { DateTime } from 'luxon'
import { getMorningTime, getEveningTime } from './workingHour'
const uuidV1 = require('uuid/v1')

function addStatusToDriver (carId, alarmStatus) {
  return admin.database().ref().child('drivers')
  .orderByChild('car')
  .equalTo(carId)
  .once('value')
  .then((snapshot) => {
    snapshot.forEach((child) => {
      admin.database().ref().child('alarm_status/' + child.key).push(alarmStatus)
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
      admin.database().ref().child('alarm_status/' + child.key).push(alarmStatus)
    })
  })
}

function addAlarmStatus (alarmStatus, uid) {
  return admin.database().ref().child('alarm_status_data/' + uid).set(alarmStatus)
}

function addNotification (carId, alarmStatus, timestamp, uid) {
  return admin.database().ref().child('cars/' + carId)
  .once('value')
  .then((snapshot) => {
    let car = snapshot.val()
    let schoolId = car.school
    let userIds = new Set()
    userIds.add(schoolId)
    for (let driver of car.drivers) {
      userIds.add(driver.id)
    }
    for (let teacher of car.teachers) {
      userIds.add(teacher.id)
    }
    for (let student of car.students) {
      userIds.add(student.parent)
    }
    for (let userId of userIds) {
      console.log(userId)
      admin.database().ref().child('notifications/' + userId).push(
        {
          text: 'We detect something left over in car ' + car.plate_number,
          car: carId,
          timestamp: timestamp,
          uid: uid,
          alarm_status: alarmStatus,
          school: schoolId
        }
      )
    }
    let payload = {
      // notification: {
      //   title: 'ALERT!!',
      //   body: 'We detect sonething leftovered in car ' + car.plate_number
      // },
      data: {
        'carId': carId,
        'carPlateNumber': car.plate_number,
        'schoolId': schoolId,
        'lat': alarmStatus.location.lat.toString(),
        'lng': alarmStatus.location.lng.toString(),
        'type': 'ALERT',
        'uid': uid
      }
    }
    admin.messaging().sendToTopic(carId, payload)
    .then(function (response) {
      // See the MessagingTopicResponse reference documentation for the
      // contents of response.
      console.log('Successfully sent message:', response)
    })
    .catch(function (error) {
      console.log('Error sending message:', error)
    })
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
      let timestamp = admin.database.ServerValue.TIMESTAMP
      let uid = uuidV1()
      var carId = req.body.car_id
      var alarmStatus = req.body.alarm_status
      alarmStatus.timestamp = timestamp
      alarmStatus.uid = uid
      alarmStatus.carId = carId
      alarmStatus.isReportFalse = false
      alarmStatus.data.forEach(d => {
        delete d.timestamp
        d.timestamp = timestamp
      })

      let isWorkingHour = await isInWorkingHour(carId)
      console.log(isWorkingHour)
      if (true || isWorkingHour && isDetected(alarmStatus)) {
        var notification = addNotification(carId, alarmStatus, timestamp, uid)
        var drivers = addStatusToDriver(carId, alarmStatus)
        var teachers = addStatusToTeacher(carId, alarmStatus)
        var status = addAlarmStatus(alarmStatus, uid)

        var result = await Promise.all([
          notification,
          drivers,
          teachers,
          status
        ])

        res.json(result)
      } else {
        res.json()
      }
    } catch (err) {
      console.log('Error:', err)
      res.status(400).json(err)
    }
  })
}
