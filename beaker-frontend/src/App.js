import React, { Component } from 'react'
import { Col, Jumbotron, Grid, Row, Table } from 'react-bootstrap'
import './App.css'

const DataTable = ({users}) => {
  if (!users) return null
  const output = users.map((user) => {
    return (<tr><td key={user.id}>{user.FirstName}</td><td>{user.LastName}</td><td>{user.Address}</td><td>{user.City}</td></tr>)
  })
  return (
    <tbody>
      {output}
    </tbody>
  )
}

class App extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      data: []
    }
  }

  componentWillMount () {
    fetch('/api/users')
      .then((output) => output.json())
      .then((output) => {
        this.setState({data: output.data})
      })
      .catch(error => {
        console.log(error)
      })
  }

  render () {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12} md={10}>
              <Jumbotron>
                <h1>User Manager</h1>
                <p>Here are our great users</p>
              </Jumbotron>
              <Table>
                <thead>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>address</th>
                  <th>city</th>
                </thead>
                <DataTable users={this.state.data}/>
              </Table>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default App
