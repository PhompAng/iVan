function randomNum () {
  return Math.floor(Math.random() * 9)
}

export default function mockStudentId () {
  let tel = ''
  for (let i = 0; i < 5; i++) {
    tel += randomNum()
  }
  return tel
}
