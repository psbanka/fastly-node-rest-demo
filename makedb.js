require('dotenv').config()
const faker = require('faker')
const avatar = require('avatar-generator')()
const mysql = require('mysql')
const md5 = require('blueimp-md5')

const DATA_MAP = [
  {field: 'Email', size: 255, generator: faker.internet.email},
  {field: 'LastName', size: 255, generator: faker.name.lastName},
  {field: 'FirstName', size: 255, generator: faker.name.firstName},
  {field: 'Address', size: 255, generator: faker.address.streetAddress},
  {field: 'City', size: 255, generator: faker.address.city},
  {field: 'Password', size: 255, generator: () => md5(faker.address.city())}
]

const createTable = (connection) => {
  const fields = DATA_MAP.map(({field, size}) => `${field} varchar(${size})`).join(', ')

  return new Promise((resolve, reject) => {
    connection.query('DROP TABLE Persons', () => {
      let query = `
        CREATE TABLE Persons (
          ID int NOT NULL AUTO_INCREMENT,
          ${fields},
          Avatar TEXT(100000),
          PRIMARY KEY (ID)
        );
      `
      connection.query(query, (err, results) => {
        if (err) reject(err)
        resolve()
      })
    })
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        connection.query('DROP TABLE Photos', () => {
          let query = `
            CREATE TABLE Photos (
              ID int NOT NULL AUTO_INCREMENT,
              Email varchar(255),
              Photo TEXT(10000000),
              PRIMARY KEY (ID)
            );
          `
          connection.query(query, (err, results) => {
            if (err) reject(err)
            resolve()
          })
        })
      })
    })
}

const createRecord = (connection, record) => {
  return new Promise((resolve, reject) => {
    const email = record.email || faker.internet.email()
    const gender = Math.random() < 0.5 ? 'male' : 'female'
    avatar(email, gender, 400).toBuffer(function (err, buffer) {
      if (err) reject(err)
      const imageSlug = 'data:image/png;base64,' + buffer.toString('base64')
      const lname = faker.name.lastName()
      const mainValues = DATA_MAP.map(({generator, field}) => {
        return `"${record[field] || generator()}"`
      }).join(', ')
      const fieldNames = DATA_MAP.map(({field}) => field).join(', ')
      const query = `
      INSERT INTO Persons (${fieldNames}, Avatar) VALUES
        (${mainValues}, "${imageSlug}")
      `
      connection.query(query, (err2, results) => {
        if (err2) reject(err)
        console.log('done', lname)
        resolve()
      })
    })
  })
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

const recordCount = parseInt(process.argv[2] || 20)
console.log(`Creating ${recordCount} records...`)

createTable(connection)
  .then(() => {
    return createRecord(connection, {Email: 'admin', Password: md5('abc123')})
  })
  .then(() => {
    Promise.all(Array(recordCount).fill().map(() => createRecord(connection, {})))
      .then(() => {
        connection.end()
        console.log('done')
      })
  })
