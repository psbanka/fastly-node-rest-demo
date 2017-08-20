/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import DataTable from './DataTable'
import UserDetails from './UserDetails'
import ErrorAlert from './ErrorAlert'
import { Col, Jumbotron, Table, Panel } from 'react-bootstrap'
import axios from 'axios'
/* eslint-enable no-unused-vars */

const MINIMUM_SAVE_TIME = 500

export default class Admin extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      pageNumber: 0,
      data: [],
      editUser: null,
      errorMessages: [],
      headers: {},
      loadTime: 0,
      saving: false,
      totalPages: 0,
      userId: null
    }
    this.axios = axios.create()
    this.axios.defaults.headers.common['Content-Type'] = 'application/json'
    this.axios.defaults.headers.get['Content-Type'] = 'application/json'
    this.axios.defaults.headers.post['Content-Type'] = 'application/json'

    this.selectRow = this.selectRow.bind(this)
    this.changeEditUser = this.changeEditUser.bind(this)
    this.saveEditUser = this.saveEditUser.bind(this)
    this.cancelEditUser = this.cancelEditUser.bind(this)
    this.clearErrors = this.clearErrors.bind(this)
    this.changePage = this.changePage.bind(this)
  }

  selectRow (userId) {
    const editUser = Object.assign({}, this.state.data[userId])
    this.setState({userId, editUser})
  }

  /////////////////////
  //  Editing users  //
  /////////////////////

  changeEditUser (field, newValue) {
    const newEditUser = Object.assign({}, this.state.editUser)
    newEditUser.attributes[field] = newValue
    this.setState({editUser: newEditUser})
  }

  cancelEditUser () {
    this.setState({userId: null, editUser: null})
  }

  finalizeSave (output) {
    const newData = this.state.data.map((i) => Object.assign({}, i))
    newData[this.state.editUser.id - 1] = output.data[0]
    this.setState({data: newData, saving: false})
  }

  saveEditUser () {
    const newData = this.state.data.map((i) => Object.assign({}, i))
    newData[this.state.userId] = this.state.editUser
    this.setState({data: newData, saving: true})
    const saveStart = new Date()

    this.axios.put(`/api/user/${this.state.editUser.id}`, this.state.editUser)
      .then((output) => {
        const saveFinish = new Date()
        const extraWait = MINIMUM_SAVE_TIME - (saveFinish - saveStart)
        if (extraWait <= 0) {
          this.finalizeSave(output.data)
        } else {
          setTimeout(() => this.finalizeSave(output.data), extraWait)
        }
      })
      .catch(error => {
        console.log(error)
        this.addError('Unable to save user to database')
        this.setState({saving: false})
      })
  }

  //////////////
  //  Errors  //
  //////////////

  addError (message) {
    const newErrors = this.state.errorMessages.map((i) => i)
    newErrors.push(message)
    this.setState({errorMessages: newErrors})
  }

  clearErrors () {
    this.setState({errorMessages: []})
  }

  //////////////////
  //  Pagination  //
  //////////////////

  changePage (pageNumber) {
    this.fetchPage(pageNumber)
  }

  fetchPage (pageNumber) {
    const startTime = new Date()
    let headers = {}
    this.axios.get(`/api/users?page=${pageNumber}`)
      .then((output) => {
        ;['X-Cache', 'X-Cache-Hits', 'X-Served-By'].forEach((key) => {
          headers[key] = output.headers[key]
        })
        const finishTime = new Date()
        const loadTime = finishTime - startTime
        const totalPages = output.data.meta['total-pages']
        this.setState({
          data: output.data.data,
          editUser: null,
          headers,
          loadTime,
          pageNumber,
          totalPages,
          userId: null
        })
      })
      .catch(error => {
        if (error.response.status === 404) {
          this.props.onUserLogout()
        } else {
          console.log(error)
          this.addError('Could not fetch data from the server')
        }
      })
  }

  componentWillMount () {
    this.fetchPage(0)
  }

  render () {
    return (
      <div>
        <Jumbotron style={{display: 'flex', justifyContent: 'space-between'}}>
          <h1>User Manager</h1>
          <Panel>
            <div style={{width: '420px'}}>
              <Table>
                <tbody>
                  <tr><td><b>Time to load data</b></td><td>{this.state.loadTime}ms</td></tr>
                  <tr><td><b>X-Cache</b></td><td>{this.state.headers['X-Cache']}</td></tr>
                  <tr><td><b>X-Cache-Hits</b></td><td>{this.state.headers['X-Cache-Hits']}</td></tr>
                  <tr><td><b>X-Served-By</b></td><td>{this.state.headers['X-Served-By']}</td></tr>
                </tbody>
              </Table>
            </div>
          </Panel>
        </Jumbotron>
        <Col xs={12} md={8}>
          <ErrorAlert
            errors={this.state.errorMessages}
            handleAlertDismiss={this.clearErrors}
          />
          <DataTable
            users={this.state.data}
            onClick={this.selectRow}
            currentPage={this.state.pageNumber}
            changePage={this.changePage}
            totalPages={this.state.totalPages}
          />
        </Col>
        <Col xs={6} md={4}>
          <Panel>
            <UserDetails
              editUser={this.state.editUser}
              onChange={this.changeEditUser}
              onSave={this.saveEditUser}
              onCancel={this.cancelEditUser}
              saving={this.state.saving}
            />
          </Panel>
        </Col>
      </div>
    )
  }
}
