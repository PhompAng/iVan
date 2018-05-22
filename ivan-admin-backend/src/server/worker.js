import createQueueChannel from './channel'

var queue = 'queue'

createQueueChannel(queue)
.then(channel => {
  console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue)
  channel.consume(queue, (msg) => {
    console.log(' [x] Received %s', msg.content.toString())
  }, {noAck: true})
})
.catch(error => console.log(error))
