import * as admin from 'firebase-admin'
import createQueueChannel from './channel'
import { DateTime } from 'luxon'
import { isInRange } from './distanceUtils'
import { getMorningTime, getEveningTime } from './workingHour'

const minDistance = 1000

function sendNotification (carId) {
  let payload = {
    notification: {
      title: 'WARNING',
      body: 'รถใกล้ถึงบ้านแล้วจ้า'
    },
    data: {
      'type': 'NOTIFY'
    }
  }
  admin.messaging().sendToTopic(carId, payload)
}

function saveHistoryToStudent (waypoint, studentId) {
  let date = DateTime.local().toISODate()
  admin.database().ref().child('students/' + studentId).child('car_history').child(date).push(waypoint)
}

function getCarHistoryRef (car, carId) {
  let date = DateTime.local().toISODate()
  let inMorningTime = getMorningTime(car).contains(DateTime.local())
  let inEveningTime = getEveningTime(car).contains(DateTime.local())
  let carHistoryRef = admin.database().ref().child('car_history/' + carId)
  if (inMorningTime) {
    return carHistoryRef.child(date).child('morning')
  } else if (inEveningTime) {
    return carHistoryRef.child(date).child('evening')
  }
  return null
}

function getWaypoint (car) {
  let inMorningTime = getMorningTime(car).contains(DateTime.local())
  let inEveningTime = getEveningTime(car).contains(DateTime.local())
  if (inMorningTime) {
    return car.route.morning.waypoints
  } else if (inEveningTime) {
    return car.route.evening.waypoints
  }
  return null
}

async function saveCarHistory (waypoints, carLocation, carHistoryRef, carId) {
  let rawCarHistory = await carHistoryRef.once('value')
  let carHistory = rawCarHistory.val()
  if (carHistory == null) {
    if (isInRange(waypoints[0].location, carLocation, minDistance)) {
      let w = waypoints[0]
      w.timestamp = admin.database.ServerValue.TIMESTAMP
      carHistoryRef.push(w)
      saveHistoryToStudent(w, w.id)
      sendNotification(carId)
    }
  } else {
    let waypoint = waypoints[rawCarHistory.numChildren()]
    waypoint.timestamp = admin.database.ServerValue.TIMESTAMP
    if (waypoint != null && isInRange(waypoint.location, carLocation, minDistance)) {
      carHistoryRef.push(waypoint)
      saveHistoryToStudent(waypoint, waypoint.id)
      sendNotification(carId)
    } else {
        // TODO check reach school
    }
  }
}

async function checkNearHome (waypoints, car, carLocation) {
  let carId = car.id
  if (car.time != null) {
    let carHistoryRef = getCarHistoryRef(car, carId)
    if (carHistoryRef != null) {
      await saveCarHistory(waypoints, carLocation, carHistoryRef, carId)
    }
  }
}

export default (queue) => {
  createQueueChannel(queue)
  .then(channel => {
    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue)
    channel.consume(queue, async (msg) => {
      let req = JSON.parse(msg.content.toString())
      console.log(' [x] Received %s: %s', queue, msg.content.toString())
      try {
        var carId = req.car_id
        var status = req.mobility_status
        delete status.timestamp
        status.timestamp = admin.database.ServerValue.TIMESTAMP
        let carLocation = {
          lat: status.lat,
          lng: status.lng
        }

        let rawCar = await admin.database().ref().child('cars/' + carId).once('value')
        let car = rawCar.val()

        let waypoints = getWaypoint(car)
        if (waypoints != null) {
          await checkNearHome(waypoints, car, carLocation)
        }

        await admin.database().ref().child('mobility_status').child(car.school).child(carId).push(status)

        console.log('Success!')
      } catch (err) {
        console.error('Error: ', err)
      }
    }, {noAck: true})
  })
  .catch(error => console.log(error))
}
