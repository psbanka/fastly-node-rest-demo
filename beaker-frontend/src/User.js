/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Col, Jumbotron, Panel, FormGroup, FormControl, Button, ButtonToolbar } from 'react-bootstrap'

import axios from 'axios'
import ImageUploader from './ImageUploader'
import PhotoTable from './PhotoTable'

/* eslint-enable no-unused-vars */

export default class User extends Component {
  constructor () {
    super(...arguments)
    this.axios = axios.create()
    this.axios.defaults.headers.common['Content-Type'] = 'application/json'
    this.axios.defaults.headers.get['Content-Type'] = 'application/json'
    this.axios.defaults.headers.post['Content-Type'] = 'application/json'
    this.state = {
      newPhoto: null,
      photos: [],
      saving: false
    }
    this.onChange = this.onChange.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  componentWillMount () {
    if (this.props.auth.username) {
      this.axios.get(`/api/photos/${this.props.auth.username}`)
        .then(output => {
          this.setState({photos: output.data.data})
        })
        .catch(error => {
          console.log('ERROR: ', error)
        })
    }
  }

  onChange (newPhoto) {
    this.setState({newPhoto})
  }

  onSave () {
    const data = {
      email: this.props.auth.username,
      photo: this.state.newPhoto
    }
    const self = this

    this.axios.post(`/api/photos/${this.props.auth.username}`, data)
      .then(output => {
        self.state.photos.push(output.data.data[0])
        self.setState({newPhoto: null, saving: false, photos: self.state.photos})
      })
      .catch(error => {
        console.log('onSave (bad)', error)
        console.log('ERROR in User.onSave: ', error)
      })
  }

  render () {
    const disabled = (this.saving || this.state.newPhoto == null)
    const saveText = this.saving ? 'Uploading...' : 'Upload'
    return (
      <div>
        <Jumbotron style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <h1>Photo Manager</h1>
            <p>{this.props.currentUser.FirstName} {this.props.currentUser.LastName}</p>
          </div>
          <div>
            <img alt="User Avatar" src={this.props.currentUser.Avatar} style={{width: '100px', height: '100px'}}></img> 
          </div>
        </Jumbotron>
        <Col xs={12} md={8}>
          <form>
            <FormGroup>
              <ImageUploader avatar={this.state.newPhoto} onChange={(data) => this.onChange(data)} />
              <FormControl.Feedback />
              <ButtonToolbar>
                <Button disabled={disabled} bsSize="large" bsStyle="primary" onClick={this.onSave}>
                  {saveText}
                </Button>
              </ButtonToolbar>
            </FormGroup>
          </form>
          <PhotoTable photos={this.state.photos} />
        </Col>
      </div>
    )
  }
}
