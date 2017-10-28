let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function randomString (length) {
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export default function mockChassis () {
  return randomString(17)
}
