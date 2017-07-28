const express = require('express')
const app = express()
const mysql = require('mysql')
app.use(require('body-parser').json())

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'beaker',
  password: 'beakerpass',
  database: 'beaker'
})

connection.connect((err) => {
  if (err) throw err
  console.log('Connected to mysql')
})

app.get('/users', (req, res) => {
  connection.query('select * from Persons', (err, response) => {
    if (err) throw err
    res.send({ output: response })
  })
})

app.post('/endpoint', (req, res) => {
  console.log(req.body) // all your JSON gets spit out
  res.send({ answer: 'acknowledged' })
})

const port = process.env.NODE_PORT || 3000
const server = app.listen(port, () => console.log(`server listening on port ${port}`))

function cleanup () {
  server.close(() => {
    console.log('Closed out remaining connections.')
    connection.end()
    console.log('done')
    process.exit()
  })

  setTimeout(() => {
    console.error('Could not close connections in time, forcing shut down')
    process.exit(1)
  }, 30 * 1000)
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
