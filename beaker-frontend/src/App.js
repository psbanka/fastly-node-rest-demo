/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import {
  Alert, Col, Jumbotron, Grid, FormGroup, FormControl,
  ControlLabel, HelpBlock, Panel, Row
} from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom'
import axios from 'axios'
import Admin from './Admin'
import Login from './Login'
import './App.css'
/* globals Headers */

const AUTH_STATES = {
  UNKNOWN: 0,
  CHECKING: 1,
  LOGGED_OUT: -1,
  LOGGED_IN: 2,
  BAD_PASSWORD: 3
}

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const Logout = () => {
  const instance = axios.create()
  instance.defaults.headers.common['Content-Type'] = 'application/json'
  instance.defaults.headers.get['Content-Type'] = 'application/json'
  instance.defaults.headers.post['Content-Type'] = 'application/json'
  instance.get('/api/logout')
    .then(() => {
      console.log('LOGGED OUT')
    })
  return (
    <div>
      <h2>Logout</h2>
    </div>
  )
}

class App extends Component {
  constructor () {
    super(...arguments)
    this.axios = axios.create()
    this.axios.defaults.headers.common['Content-Type'] = 'application/json'
    this.axios.defaults.headers.get['Content-Type'] = 'application/json'
    this.axios.defaults.headers.post['Content-Type'] = 'application/json'
    // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    this.state = {
      auth: {
        id: null,
        state: AUTH_STATES.UNKNOWN,
        username: '',
        password: ''
      }
    }
    this.onUserChange = this.onUserChange.bind(this)
    this.onUserLogin = this.onUserLogin.bind(this)
    this.onUserLogout = this.onUserLogout.bind(this)
  }

  onUserLogout () {
    const history = this.props.history
    this.axios.get('/api/logout')
      .then(() => {
        history.push('/login')
      })
      .catch((error) => {
        console.log('error on logout:', error)
      })
  }

  onUserLogin () {
    const newAuth = {
      state: AUTH_STATES.CHECKING,
      username: this.state.username,
      password: this.state.password
    }
    this.setState({auth: newAuth})

    this.axios.post('/api/login', this.state.auth)
      .then(output => {
        console.log('success', output)
        const newAuth = {
          state: AUTH_STATES.LOGGED_IN,
          id: output.data.id,
          username: output.data.username
        }
        this.setState({auth: newAuth})
        this.props.history.push('/')
      })
      .catch(error => {
        console.log('error', error)
        if (error.response.status === 401) {
          const newAuth = {
            state: AUTH_STATES.BAD_PASSWORD,
            username: this.state.username,
            password: ''
          }
          this.setState({auth: newAuth})
        } else {
          console.warn('UNKNOWN ERROR', error)
        }
      })
  }

  onUserChange (field, value) {
    const authCopy = Object.assign({}, this.state.auth)
    authCopy[field] = value
    this.setState({auth: authCopy})
  }

  checkAuth () {
    this.axios.get('/api/profile')
      .then(output => {
        this.setState({auth: {state: AUTH_STATES.LOGGED_IN}})
      })
      .catch(output => {
        this.props.history.push('/login')
        this.setState({auth: {state: AUTH_STATES.LOGGED_OUT}})
        console.log('ERROR: ', output)
      })
  }

  componentWillMount () {
    this.checkAuth()
  }

  render () {
    if (this.state.auth.state === AUTH_STATES.UNKNOWN) {
      return (
        <h1>Checking auth...</h1>
      )
    }
    return (
      <Router>
        <div>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/logout">Logout</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </ul>
          <Grid>
            <Row>
              <Route path="/" component={Home}/>
              <Route path="/logout" component={Logout}/>
              <Route path="/admin" render={() => (
                <Admin
                  onUserLogout={this.onUserLogout}
                />
              )}/>
              <Route path="/login" render={() => (
                <Login
                  auth={this.state.auth}
                  onSubmit={this.onUserLogin}
                  onUserChange={this.onUserChange}
                />)}
              />
            </Row>
          </Grid>
        </div>
      </Router>
    )
  }
}

// export default App
export default withRouter(App)
