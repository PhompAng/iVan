function randomNum () {
  return Math.floor(Math.random() * 9)
}

export default function mockTel () {
  let tel = '0'
  for (let i = 1; i < 10; i++) {
    tel += randomNum()
  }
  return tel
}
