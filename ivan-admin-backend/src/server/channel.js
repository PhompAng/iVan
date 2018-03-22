var amqp = require('amqplib')

const url = process.env.AMQP_URL || 'amqp://guest:guest@localhost:5672'

console.log(url)
export default function createQueueChannel (queue) {
  return amqp.connect(url)
  .then(conn => conn.createChannel())
  .then(channel => {
    channel.assertQueue(queue, {durable: true})
    return channel
  })
  .catch(error => console.log(error))
}
