const connectToMongo=require('./db');
const express = require('express')
var cors = require('cors')
connectToMongo();
const app = express()

app.use(cors())

const port = 5000

app.use(express.json())
//Avilable routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/event',require('./routes/event'))
app.use('/api/registration',require('./routes/registration'))

app.listen(port, () => {
  console.log(`EventManagement app listening on port ${port}`)
})
 