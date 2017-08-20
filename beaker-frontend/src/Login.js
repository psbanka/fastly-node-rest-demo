/* eslint-disable no-unused-vars */
import React from 'react'
import { Alert, Col, Jumbotron, Table, Panel, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar } from 'react-bootstrap'

/* eslint-enable no-unused-vars */

export default ({auth, onUserChange, onSubmit}) => {
  const saving = false
  const submitText = 'Submit'
  let alert = null
  if (auth.state === 3) {
    alert = (<Alert bsStyle='danger'><h4>Incorrect password</h4></Alert>)
  }
  return (
    <div>
      <Jumbotron style={{display: 'flex', justifyContent: 'space-between'}}>
        <h1>Login</h1>
      </Jumbotron>
      <Col xs={12} md={8}>
        {alert}
        <form>
          <Panel>
            <FormGroup>
              <ControlLabel>Username</ControlLabel>
              <FormControl
                type="text"
                disabled={saving}
                value={auth.username}
                placeholder="Enter username"
                onChange={(e) => onUserChange('username', e.target.value)}
              />
              <ControlLabel>Password</ControlLabel>
              <FormControl
                type="password"
                disabled={saving}
                value={auth.password}
                placeholder="Enter password"
                onChange={(e) => onUserChange('password', e.target.value)}
              />
            </FormGroup>
          </Panel>
          <ButtonToolbar>
            <Button disabled={saving} bsSize="large" bsStyle="primary" onClick={onSubmit}>
              {submitText}
            </Button>
          </ButtonToolbar>
        </form>
      </Col>
    </div>
  )
}
