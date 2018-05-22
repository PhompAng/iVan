const speedExceedWeight = 1
const engineWeight = 1
const brakeWeight = 1

function getSpeedExceedStar (speedExceed, mileage) {
  let ratio = speedExceed / mileage
  console.log('ratio: ' + ratio)
  if (ratio <= 0.1) {
    return 5
  } else if (ratio <= 0.2) {
    return 4
  } else if (ratio <= 0.3) {
    return 3
  } else if (ratio <= 0.4) {
    return 2
  } else if (ratio <= 0.5) {
    return 1
  } else {
    return 0
  }
}

function getMileageStar (mileage) {
  if (mileage <= 5000) {
    return 5
  } else if (mileage <= 6000) {
    return 4
  } else if (mileage <= 7000) {
    return 3
  } else if (mileage <= 8000) {
    return 2
  } else if (mileage <= 9000) {
    return 1
  } else {
    return 0
  }
}

function calculateStar (mobilityStatus) {
  let speedExceedStar = getSpeedExceedStar(mobilityStatus.speed_exceed, mobilityStatus.mileage)
  let engineStar = getMileageStar(mobilityStatus.engine_oil_mileage)
  let brakeStar = getMileageStar(mobilityStatus.brake_oil_mileage)
  console.log('speed:' + speedExceedStar + ', engine: ' + engineStar + ', brake: ' + brakeStar)
  return ((speedExceedWeight * speedExceedStar) + (engineWeight * engineStar) + (brakeWeight * brakeStar)) / (speedExceedWeight + engineWeight + brakeWeight)
}

export default { calculateStar }
