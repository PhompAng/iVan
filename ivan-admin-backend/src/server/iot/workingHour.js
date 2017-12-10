import { DateTime, Interval } from 'luxon'

function getMorningTime (car) {
  let morningStartTime = DateTime.fromObject(
    {
      hour: +car.time.morning.start.HH,
      minute: +car.time.morning.start.mm
    })
  let morningEndTime = DateTime.fromObject(
    {
      hour: +car.time.morning.end.HH,
      minute: +car.time.morning.end.mm
    }
  )
  return Interval.fromDateTimes(morningStartTime, morningEndTime)
}

function getEveningTime (car) {
  let eveningStartTime = DateTime.fromObject(
    {
      hour: +car.time.evening.start.HH,
      minute: +car.time.evening.start.mm
    })
  let eveningEndTime = DateTime.fromObject(
    {
      hour: +car.time.evening.end.HH,
      minute: +car.time.evening.end.mm
    }
  )
  return Interval.fromDateTimes(eveningStartTime, eveningEndTime)
}

export default { getMorningTime, getEveningTime }
