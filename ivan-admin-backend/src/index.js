import server from '~/server'
import * as admin from 'firebase-admin'
var serviceAccount = require('~/resources/ivan-f1006-firebase-adminsdk-qvw3d-7f360dc20e.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ivan-f1006.firebaseio.com',
  storageBucket: 'gs://ivan-f1006.appspot.com/'
})

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
