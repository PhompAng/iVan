function randomString (length) {
  let chars = 'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ'
  let result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

function randomNum (length) {
  let result = ''
  for (var i = length; i > 0; --i) result += Math.floor(Math.random() * 9)
  return result
}

export default function mockPlate () {
  return randomString(2) + '-' + randomNum(4)
}
