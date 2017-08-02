/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import {
  Alert, Col, Jumbotron, Grid, FormGroup, FormControl,
  ControlLabel, HelpBlock, Panel, Row, Table } from 'react-bootstrap'
import DataTable from './DataTable'
import UserDetails from './UserDetails'
import ErrorAlert from './ErrorAlert'

import './App.css'

/* globals fetch Headers */

class App extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      data: [],
      editUser: null,
      errorMessages: [],
      headers: {},
      loadTime: 0,
      userId: null
    }
    this.selectRow = this.selectRow.bind(this)
    this.changeEditUser = this.changeEditUser.bind(this)
    this.saveEditUser = this.saveEditUser.bind(this)
    this.cancelEditUser = this.cancelEditUser.bind(this)
    this.clearErrors = this.clearErrors.bind(this)
  }

  selectRow (userId) {
    const editUser = Object.assign({}, this.state.data[userId])
    this.setState({userId, editUser})
  }

  changeEditUser (field, newValue) {
    const newEditUser = Object.assign({}, this.state.editUser)
    newEditUser[field] = newValue
    this.setState({editUser: newEditUser})
  }

  cancelEditUser () {
    this.setState({userId: null, editUser: null})
  }

  saveEditUser () {
    const newData = this.state.data.map((i) => Object.assign({}, i))
    newData[this.state.userId] = this.state.editUser
    this.setState({data: newData})

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const myInit = {
      method: 'PUT',
      body: JSON.stringify(this.state.editUser),
      headers: myHeaders,
      mode: 'cors',
      cache: 'default'
    }

    fetch(`/api/user/${this.state.editUser.ID}`, myInit)
      .then((output) => output.json())
      .then((output) => {
        const newData = this.state.data.map((i) => Object.assign({}, i))
        newData[this.state.editUser.ID - 1] = output.data[0]
        this.setState({data: newData})
      })
      .catch(error => {
        console.log(error)
        this.addError('Unable to save user to database')
      })
  }

  addError (message) {
    const newErrors = this.state.errorMessages.map((i) => i)
    newErrors.push(message)
    this.setState({errorMessages: newErrors})
  }

  clearErrors () {
    this.setState({errorMessages: []})
  }

  componentWillMount () {
    const startTime = new Date()
    let headers = {}
    fetch('/api/users')
      .then((output) => {
        ;['X-Cache', 'X-Cache-Hits', 'X-Served-By'].forEach((key) => {
          headers[key] = output.headers.get(key)
        })
        return output.json()
      })
      .then((output) => {
        const finishTime = new Date()
        const loadTime = finishTime - startTime
        this.setState({data: output.data, loadTime, headers})
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
            </Jumbotron>
            <Panel>
              <Table>
                <tr><td>Time to load data</td><td>{this.state.loadTime}ms</td></tr>
                <tr><td>X-Cache</td><td>{this.state.headers['X-Cache']}</td></tr>
                <tr><td>X-Cache-Hits</td><td>{this.state.headers['X-Cache-Hits']}</td></tr>
                <tr><td>X-Served-By</td><td>{this.state.headers['X-Served-By']}</td></tr>
              </Table>
            </Panel>
            <Col xs={12} md={8}>
              <ErrorAlert errors={this.state.errorMessages} handleAlertDismiss={this.clearErrors}/>
              <DataTable users={this.state.data} onClick={this.selectRow}/>
            </Col>
            <Col xs={6} md={4}>
              <Panel>
                <UserDetails
                  editUser={this.state.editUser}
                  onChange={this.changeEditUser}
                  onSave={this.saveEditUser}
                  onCancel={this.cancelEditUser}
                />
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default App
