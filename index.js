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

app.get('/api/users', (req, res) => {
  connection.query('select * from Persons', (err, response) => {
    if (err) throw err
    res.send({ data: response })
  })
})

app.get('/api/user/:userId', (req, res) => {
  connection.query(`select * from Persons where ID=${req.body.ID}`, (err, response) => {
    if (err) throw err
    res.send({ data: response })
  })
})

app.post('/api/user/:userId', (req, res) => {
  // TODO: Validate req.body
  const fields = Object.keys(req.body).map((key) => {
    if (key === 'ID') return
    return `${key} = "${req.body[key]}"`
  }).filter(Boolean)
  const query = `update Persons set ${fields.join(', ')} where ID=${req.body.ID}`

  connection.query(query, (err, response) => {
    if (err) throw err
    connection.query(`select * from Persons where ID=${req.body.ID}`, (err, response) => {
      if (err) throw err
      res.send({ data: response })
    })
  })
})

const port = process.env.NODE_PORT || 3333
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
