import * as nameTh from './nameTh'
import * as nameEn from './nameEn'

function randomTh () {
  return nameTh.name[Math.floor(Math.random() * nameTh.name.length)]
}

function randomEn () {
  return nameEn.name[Math.floor(Math.random() * nameEn.name.length)]
}

export default function mockName () {
  let name = {}
  name.th_first = randomTh()
  name.th_last = randomTh()
  name.en_first = randomEn()
  name.en_last = randomEn()
  return name
}
