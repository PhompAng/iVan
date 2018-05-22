import * as car from './carBrand'

function randomCar () {
  return car.brand[Math.floor(Math.random() * car.brand.length)]
}

export default function mockName () {
  return randomCar()
}
