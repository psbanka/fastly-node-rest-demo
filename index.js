require('dotenv').config()
const request = require('superagent')
const express = require('express')
const app = express()
const mysql = require('mysql')
const validator = require('validator')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


////////////////////////////////////////////////////////////////////////
//                    Trivial authentication code                     //
////////////////////////////////////////////////////////////////////////

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('USING strategy')
    return done(null, {username: 'admin', id: 1})
    /*
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
    */
  }
))

passport.serializeUser(function (user, cb) {
  cb(null, user.id)
})

passport.deserializeUser(function (id, cb) {
  cb(null, {id: 1, username: 'admin'})
})

////////////////////////////////////////////////////////////////////////
//                        App initialization                          //
////////////////////////////////////////////////////////////////////////

app.use(require('cookie-parser')())
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

app.use(require('body-parser').json({limit: '10mb'}))
app.use(express.static('public'))

// Default all content-type to JSON
app.use(function (req, res, next) {
  res.contentType('application/json')
  next()
})

////////////////////////////////////////////////////////////////////////
//                         Utility functions                          //
////////////////////////////////////////////////////////////////////////

const addrValidator = (str) => {
  return validator.matches(str, '^[0-9]+ .+$')
}

const avatarValidator = (str) => {
  return validator.matches(str, 'data:image\/([a-zA-Z]*);base64,([^\"]*)')
}

const cityValidator = (str) => {
  return validator.matches(str, '[a-z|A-Z| ]+')
}

const getSurrogateKeys = (records, type) => {
  return records.map(record => `${type}-${record.ID}`)
}

const sendJsonApiResponse = (res, records, type, pagination) => {
  const formattedResponse = records.map(record => {
    return {
      type,
      id: record.ID,
      attributes: record
    }
  })
  res.setHeader('Cache-Control', 'no-cache') // User-agent: do not cache
  const surrogateKeys = getSurrogateKeys(records, type)
  console.log('surrogateKeys:', surrogateKeys)
  res.setHeader('Surrogate-Key', surrogateKeys.join(' ')) // Fastly: Categorize content
  res.setHeader('Surrogate-Control', 'max-age=86400') // Fastly: cache for a day
  res.setHeader('Content-type', 'application/json')
  const output = { data: formattedResponse }
  if (pagination) {
    const lastPage = Math.ceil(pagination.count / PAGE_SIZE)
    output.meta = { 'total-pages': lastPage }
    output.links = {
      'self': `/api/users?page=${pagination.pageNumber}`,
      first: `/api/users?page=0`,
      last: `/api/users?page=${lastPage}`
    }
    if (pagination.pageNumber > 0) {
      output.links.prev = `/api/users?page=${pagination.pageNumber - 1}`
    }
    if (pagination.pageNumber < lastPage) {
      output.links.next = `/api/users?page=${pagination.pageNumber + 1}`
    }
  }
  res.send(output)
}

const purgeCache = (surrogateKeys) => {
  if (!process.env.FASTLY_KEY || !process.env.SERVICE_ID) {
    console.log('not configured to clear cache.')
    return
  }
  const url = `${FASTLY_URL}/service/${process.env.SERVICE_ID}/purge`
  request
    .post(url)
    .send({ surrogate_keys: surrogateKeys })
    .set('Fastly-Key', process.env.FASTLY_KEY)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      if (err) {
        console.log('error from fastly:', err)
        return
      }
      if (res.statusCode === 200) {
        console.log(`purged ${surrogateKeys}`)
      } else {
        console.log('error clearing cache: ', res.statusCode)
      }
    })
}

////////////////////////////////////////////////////////////////////////
//                             Constants                              //
////////////////////////////////////////////////////////////////////////

const PAGE_SIZE = 20

const USER_TYPE = 'user'

const FASTLY_URL = 'https://api.fastly.com'

const DATA_MAP = {
  'Email': validator.isEmail,
  'LastName': validator.isAlpha,
  'FirstName': validator.isAlpha,
  'Address': addrValidator,
  'City': cityValidator,
  'Avatar': avatarValidator
}

////////////////////////////////////////////////////////////////////////
//                           Express routes                           //
////////////////////////////////////////////////////////////////////////

//////////////////////
//  Authentication  //
//////////////////////

/*
app.post('/login',
  passport.authenticate('local'),
  function (req, res) {
    console.log('success!')
    res.redirect('/')
  }
)
*/

app.post('/api/login', (req, res) => {
  console.log('username', req.body.username)
  console.log('password', req.body.password)
  if (req.body.username === 'admin' && req.body.password === 'abc123') {
    req.login({id: 1, username: 'admin'}, (output) => {
      console.log('auth output', output)
      return res.send({id: 1, username: 'admin'})
    })
  } else {
    res.sendStatus(401)
  }
})

app.get('/api/login', function (req, res, next) {
  console.log('====== BING')
  passport.authenticate('local', function (err, user, info) {
    console.log('------ ZING')
    if (err) { return next(err) }
    if (!user) { return res.redirect('/login') }
    req.logIn(user, function (err) {
      if (err) { return next(err) }
      return res.redirect('/users/' + user.username)
    })
  })(req, res, next)
})

app.get('/api/logout',
  function (req, res) {
    console.log('LOGGING OUT')
    req.logout()
    res.redirect('/')
  }
)

app.get('/api/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    res.send({ user: req.user })
  }
)

////////////////////
//  Manage users  //
////////////////////

/**
 * Get all users
 */
app.get('/api/users',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    const pageNumber = parseInt(req.query.page, 10) || 0
    const start = pageNumber * PAGE_SIZE
    const end = start + PAGE_SIZE
    let count = 0
    connection.query(`select COUNT(*) as count from Persons`, (err, results) => {
      if (err) throw err
      count = results[0].count
    })
    connection.query(`select * from Persons LIMIT ${start},${end}`, (err, records) => {
      if (err) throw err
      sendJsonApiResponse(res, records, USER_TYPE, {pageNumber, count})
    })
  }
)

/**
 * Get one user (USED?)
 */
app.get('/api/user/:userId', (req, res) => {
  connection.query(`select * from Persons where ID=${req.body.id}`, (err, records) => {
    if (err) throw err
    sendJsonApiResponse(res, records, USER_TYPE)
  })
})

/**
 * Replace the data for one user record with a new set of data
 */
app.put('/api/user/:userId', (req, res) => {
  const fields = Object.keys(req.body.attributes).map((key) => {
    if (key === 'ID') return
    const validator = DATA_MAP[key]
    if (!validator) {
      console.log('key not valid: ', key)
    } else if (validator(req.body.attributes[key])) {
      return `${key} = "${req.body.attributes[key]}"`
    } else {
      console.log('data does not match validation-criteria: ', key)
    }
  }).filter(Boolean)
  const query = `update Persons set ${fields.join(', ')} where ID=${req.body.id}`

  console.log('updating database...')
  connection.query(query, (err, response) => {
    if (err) throw err
    console.log('returning updated data...')
    connection.query(`select * from Persons where ID=${req.body.id}`, (err, records) => {
      if (err) throw err
      const surrogateKeys = getSurrogateKeys(records, USER_TYPE)
      purgeCache(surrogateKeys)
      sendJsonApiResponse(res, records, USER_TYPE)
    })
  })
})

////////////////////////////////////////////////////////////////////////
//                           Server startup                           //
////////////////////////////////////////////////////////////////////////

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

// purgeCache(ALL_USERS)

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
