import createQueueChannel from './channel'

var queue = 'queue'

createQueueChannel(queue)
.then(channel => {
  console.log('channel and queue created')
  var work = 'make me a sandwich'
  for (let i = 1; i <= 5; ++i) {
    setTimeout(() => {
      channel.sendToQueue(queue, encode(work))
    }, 5000)
  }
  // setImmediate(() => {
  //   channel.close()
  //   conn.close()
  // })
})
.catch(error => console.log(error))

function encode (doc) {
  return Buffer.from(JSON.stringify(doc))
}
