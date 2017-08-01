require('dotenv').config()
const express = require('express')
const app = express()
const mysql = require('mysql')
const validator = require('validator')

app.use(require('body-parser').json({limit: '10mb'}))
app.use(express.static('public'))

function addrValidator (str) {
  return validator.matches(str, '^[0-9]+ .+$')
}

function avatarValidator (str) {
  return validator.matches(str, 'data:image\/([a-zA-Z]*);base64,([^\"]*)')
}

function cityValidator (str) {
  return validator.matches(str, '[a-z|A-Z| ]+')
}

const DATA_MAP = {
  'Email': validator.isEmail,
  'LastName': validator.isAlpha,
  'FirstName': validator.isAlpha,
  'Address': addrValidator,
  'City': cityValidator,
  'Avatar': avatarValidator
}

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

connection.connect((err) => {
  if (err) throw err
  console.log('Connected to mysql')
})

/**
 * Get all users
 */
app.get('/api/users', (req, res) => {
  connection.query('select * from Persons', (err, response) => {
    if (err) throw err
    res.send({ data: response })
  })
})

/**
 * Get one user
 */
app.get('/api/user/:userId', (req, res) => {
  connection.query(`select * from Persons where ID=${req.body.ID}`, (err, response) => {
    if (err) throw err
    res.send({ data: response })
  })
})

/**
 * Replace the data for one user record with a new set of data
 */
app.post('/api/user/:userId', (req, res) => {
  const fields = Object.keys(req.body).map((key) => {
    if (key === 'ID') return
    const validator = DATA_MAP[key]
    if (!validator) {
      console.log('key not valid: ', key)
    } else if (validator(req.body[key])) {
      return `${key} = "${req.body[key]}"`
    } else {
      console.log('data does not match validation-criteria: ', key)
    }
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
