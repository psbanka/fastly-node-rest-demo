/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Col, Jumbotron, Panel } from 'react-bootstrap'
import axios from 'axios'

import UserDetails from './UserDetails'
import ErrorAlert from './ErrorAlert'
/* eslint-enable no-unused-vars */

export default class Signup extends Component {
  constructor () {
    super(...arguments)
    this.axios = axios.create()
    this.axios.defaults.headers.common['Content-Type'] = 'application/json'
    this.axios.defaults.headers.get['Content-Type'] = 'application/json'
    this.axios.defaults.headers.post['Content-Type'] = 'application/json'
    this.state = {
      saving: false,
      editUser: {
        attributes: {
          FirstName: '',
          LastName: '',
          Email: '',
          Avatar: null,
          City: '',
          Address: ''
        }
      },
      errorMessages: []
    }
    this.changeEditUser = this.changeEditUser.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.clearErrors = this.clearErrors.bind(this)
  }

  clearErrors () {
    this.setState({errorMessages: []})
  }

  changeEditUser (field, newValue) {
    const newEditUser = Object.assign({}, this.state.editUser)
    newEditUser.attributes[field] = newValue
    this.setState({editUser: newEditUser})
  }

  onSave () {
    const attributes = this.state.editUser.attributes
    const errorMessages = []
    if (!attributes.FirstName) {
      errorMessages.push('Missing first name')
    }
    if (!attributes.LastName) {
      errorMessages.push('Missing last name')
    }
    if (!attributes.Password) {
      errorMessages.push('Missing password')
    }
    if (!attributes.Email) {
      errorMessages.push('Missing email')
    }

    if (errorMessages.length === 0) {
      this.axios.post('/api/users', this.state.editUser)
        .then(output => {
          this.props.onUserLogin(this.state.editUser.attributes.Email, this.state.editUser.attributes.Password)
        })
        .catch(error => {
          this.setState({errorMessages: [error.toString()]})
          console.log('ERROR: ', error)
        })
    } else {
      this.setState({errorMessages})
    }
  }

  onCancel () {
    console.log('------------------------------------')
    console.log('We should cancel')
    console.log('------------------------------------')
  }

  render () {
    // const saving = false
    // const submitText = 'Submit'
    return (
      <div>
        <Jumbotron style={{display: 'flex', justifyContent: 'space-between'}}>
          <h1>Sign up!</h1>
        </Jumbotron>
        <Col xs={12} md={8}>
          <ErrorAlert
            errors={this.state.errorMessages}
            handleAlertDismiss={this.clearErrors}
          />
          <Panel>
            <UserDetails
              editUser={this.state.editUser}
              onChange={this.changeEditUser}
              onSave={this.onSave}
              onCancel={this.onCancel}
              saving={this.state.saving}
            />
          </Panel>
        </Col>
      </div>
    )
  }
}
