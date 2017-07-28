/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Alert, Col, Jumbotron, Grid, FormGroup, FormControl, ControlLabel, HelpBlock, Panel, Row, Table } from 'react-bootstrap'
import DataTable from './DataTable'
import UserDetails from './UserDetails'
import ErrorAlert from './ErrorAlert'

import './App.css'

/* globals fetch */

class App extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      data: [],
      errorMessages: [],
      userId: null
    }
    this.selectRow = this.selectRow.bind(this)
    this.changeUser = this.changeUser.bind(this)
    this.clearErrors = this.clearErrors.bind(this)
  }

  selectRow (userId) {
    this.setState({userId})
  }

  addError (message) {
    const newErrors = this.state.errorMessages.map((i) => i)
    newErrors.push(message)
    this.setState({errorMessages: newErrors})
  }

  changeUser (user) {
    console.log(user)
    fetch(`/api/user/${user.ID}`, {method: 'POST', body: user})
      .then((output) => output.json())
      .then((output) => {
        const newData = this.state.data.map((i) => Object.assign({}, i))
        newData[user.ID] = output.data
        this.setState({data: newData})
      })
      .catch(error => {
        console.log(error)
        this.addError('Unable to save user to database')
      })
  }

  clearErrors () {
    this.setState({errorMessages: []})
  }

  componentWillMount () {
    fetch('/api/users')
      .then((output) => output.json())
      .then((output) => {
        this.setState({data: output.data})
      })
      .catch(error => {
        console.log(error)
        this.addError('Could not fetch data from the server')
      })
  }

  render () {
    return (
      <div>
        <Grid>
          <Row>
            <Jumbotron>
              <h1>User Manager</h1>
              <p>Here are our great users</p>
            </Jumbotron>
            <Col xs={12} md={8}>
              <ErrorAlert errors={this.state.errorMessages} handleAlertDismiss={this.clearErrors}/>
              <DataTable users={this.state.data} onClick={this.selectRow}/>
            </Col>
            <Col xs={6} md={4}>
              <Panel>
                <UserDetails users={this.state.data} userId={this.state.userId} onChange={this.changeUser}/>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default App
