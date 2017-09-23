import 'babel-polyfill'
import server from '~/server'
import * as admin from 'firebase-admin'
var serviceAccount = require('~/resources/ivan-61013-firebase-adminsdk-nnum2-db72a74267')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ivan-61013.firebaseio.com',
  storageBucket: 'ivan-61013.appspot.com/'
})

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
