import * as admin from 'firebase-admin'
import createQueueChannel from './channel'
import { DateTime } from 'luxon'
import { isInRange } from './distanceUtils'
import { getMorningTime, getEveningTime } from './workingHour'
import { calculateStar } from './star'

const minDistance = 1000
const speedLimit = 80
const baseMobilityStatus = {
  speed_exceed: 0
}
const baseMaintenance = {
  brake_oil_mileage: 0,
  engine_oil_mileage: 0
}

function sendNotification (carId, studentId) {
  let payload = {
    // notification: {
    //   title: 'WARNING',
    //   body: 'รถใกล้ถึงบ้านแล้วจ้า'
    // },
    data: {
      'type': 'NOTIFY',
      'studentId': studentId
    }
  }
  admin.messaging().sendToTopic(carId, payload)
}

function saveHistoryToStudent (waypoint, studentId) {
  let date = DateTime.local().toISODate()
  delete waypoint.car_history
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

async function saveCarHistory (waypoints, carLocation, carHistoryRef, carId, timestamp) {
  let rawCarHistory = await carHistoryRef.once('value')
  let carHistory = rawCarHistory.val()
  if (carHistory == null) {
    if (isInRange(waypoints[0].location, carLocation, minDistance)) {
      let w = waypoints[0]
      w.timestamp = timestamp
      carHistoryRef.push(w)
      saveHistoryToStudent(w, w.id)
      sendNotification(carId, w.id)
    }
  } else {
    let waypoint = waypoints[rawCarHistory.numChildren()]
    waypoint.timestamp = timestamp
    if (waypoint != null && isInRange(waypoint.location, carLocation, minDistance)) {
      carHistoryRef.push(waypoint)
      saveHistoryToStudent(waypoint, waypoint.id)
      sendNotification(carId, waypoint.id)
    } else {
        // TODO check reach school
    }
  }
}

async function checkNearHome (waypoints, car, carLocation, timestamp) {
  let carId = car.id
  if (car.time != null) {
    let carHistoryRef = getCarHistoryRef(car, carId)
    if (carHistoryRef != null) {
      await saveCarHistory(waypoints, carLocation, carHistoryRef, carId, timestamp)
    }
  }
}

async function getLastMobility (schoolId, carId) {
  let values = []
  await admin.database().ref().child('mobility_status').child(schoolId).child(carId).orderByKey().limitToLast(1).once('value')
  .then(snapshot => {
    snapshot.forEach(child => {
      values.push(child.val())
    })
  })

  if (values.length > 0) {
    return values[0]
  } else {
    return baseMobilityStatus
  }
}

async function getLastMaintenance (carId) {
  let values = []
  await admin.database().ref().child('maintenance').child(carId).orderByKey().limitToLast(1).once('value')
  .then((snapshot) => {
    snapshot.forEach(child => {
      values.push(child.val())
    })
  })

  if (values.length > 0) {
    return values[0]
  } else {
    return baseMaintenance
  }
}

export default (queue) => {
  createQueueChannel(queue)
  .then(channel => {
    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue)
    channel.consume(queue, async (msg) => {
      let timestamp = admin.database.ServerValue.TIMESTAMP
      let req = JSON.parse(msg.content.toString())
      console.log(' [x] Received %s: %s', queue, msg.content.toString())
      try {
        var carId = req.car_id
        var status = req.mobility_status
        delete status.timestamp
        status.timestamp = timestamp
        let carLocation = {
          lat: status.lat,
          lng: status.lng
        }

        let rawCar = await admin.database().ref().child('cars/' + carId).once('value')
        let car = rawCar.val()

        let waypoints = getWaypoint(car)
        if (waypoints != null) {
          await checkNearHome(waypoints, car, carLocation, timestamp)
        }

        let mobilityStatus = await getLastMobility(car.school, carId)
        if (status.speed > speedLimit) {
          status.speed_exceed = mobilityStatus.speed_exceed + 1
        } else {
          status.speed_exceed = mobilityStatus.speed_exceed
        }

        let maintenance = await getLastMaintenance(carId)
        status.brake_oil_mileage = status.mileage - maintenance.brake_oil_mileage
        status.engine_oil_mileage = status.mileage - maintenance.engine_oil_mileage

        let star = calculateStar(status)
        status.star = star
        await admin.database().ref().child('mobility_status').child(car.school).child(carId).push(status)
        await admin.database().ref().child('cars').child(carId).child('star').set(star)
        console.log('Success!')
      } catch (err) {
        console.error('Error: ', err)
      }
    }, {noAck: true})
  })
  .catch(error => console.log(error))
}
