export default (app, channel, queue) => {
  app.post('/status', function (req, res) {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(req.body)))
    res.json(null)
  })
}
