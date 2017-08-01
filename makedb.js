require('dotenv').config()
const faker = require('faker')
const avatar = require('avatar-generator')()
const mysql = require('mysql')

const DATA_MAP = [
  {field: 'Email', size: 255, generator: faker.internet.email},
  {field: 'LastName', size: 255, generator: faker.name.lastName},
  {field: 'FirstName', size: 255, generator: faker.name.firstName},
  {field: 'Address', size: 255, generator: faker.address.streetAddress},
  {field: 'City', size: 255, generator: faker.address.city}
]

const createTable = (connection) => {
  let query = 'DROP TABLE Persons'
  const fields = DATA_MAP.map(({field, size}) => `${field} varchar(${size})`).join(', ')

  return new Promise((resolve, reject) => {
    connection.query(query, () => {
      query = `
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
}

const createRecord = (connection) => {
  return new Promise((resolve, reject) => {
    const email = faker.internet.email()
    const gender = Math.random() < 0.5 ? 'male' : 'female'
    avatar(email, gender, 400).toBuffer(function (err, buffer){
      if (err) reject(err)
      const imageSlug = 'data:image/png;base64,' + buffer.toString('base64')
      const lname = faker.name.lastName()
      const mainValues = DATA_MAP.map(({generator}) => `"${generator()}"`).join(', ')
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

createTable(connection)
  .then(() => {
    Promise.all(Array(20).fill().map(() => createRecord(connection)))
      .then(() => {
        connection.end()
        console.log('done')
      })
  })
