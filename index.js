const connectToMongo= require('./db');
const express = require('express')
var cors= require('cors')

connectToMongo();
const app = express()
const PORT = 5001 || process.env.PORT;

app.use(cors())
app.use(express.json())

// Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/contact', require('./routes/contact'))

app.listen(port, () => {
  console.log(`myNotebook backend listening on port ${PORT}`)
})