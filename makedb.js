const faker = require('faker')
const jig = require('js-image-generator')
const mysql = require('mysql')

const createTable = (connection) => {
  let query = 'DROP TABLE Persons'
  return new Promise((resolve, reject) => {
    connection.query(query, () => {
      query = `
        CREATE TABLE Persons (
          ID int NOT NULL AUTO_INCREMENT,
          LastName varchar(255),
          FirstName varchar(255),
          Address varchar(255),
          City varchar(255),
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
    jig.generateImage(100, 100, 80, (err, image) => {
      if (err) reject(err)

      const imageSlug = image.data.toString('base64')
      const lname = faker.name.lastName()
      const query = `
      INSERT INTO Persons (LastName, FirstName, Address, City, Avatar) VALUES
        ("${faker.name.lastName()}", "${faker.name.firstName()}", "${faker.address.streetAddress()}", "${faker.address.city()}", "${imageSlug}")
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
  host: 'localhost',
  user: 'beaker',
  password: 'beakerpass',
  database: 'beaker'
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
