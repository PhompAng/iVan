import * as admin from 'firebase-admin'

export default (app) => {
    app.get('/', function (req, res) {
        res.send('Hello World!')
    })
    app.get('/gen', async function (req, res) {
        try {
            var userRecord = await admin.auth().createUser({
                email: "user@example.com",
                emailVerified: false,
                password: "123456",
                displayName: "John Doe",
                disabled: false
            })
            res.send(userRecord.uid)
        } catch (err) {
            console.log("Error creating new user:", err)
            res.send(err)
        }
    })
    app.post('/login', async function (req, res) {
        try {
            var decodedToken = await admin.auth().verifyIdToken(req.body.idToken)
            console.log(decodedToken.uid)
            res.send(decodedToken.uid)
        } catch (err) {
            console.log(err)
        }
    })
}
