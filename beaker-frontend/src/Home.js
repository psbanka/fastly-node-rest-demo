/* eslint-disable no-unused-vars */
import React from 'react'
import { Col, ButtonToolbar, Jumbotron, Panel, Button } from 'react-bootstrap'
/* eslint-enable no-unused-vars */

export default ({avatar, onChange}) => {
  const title = Math.random() >= 0.5 ? 'Mike & Judith' : 'Judith & Mike'
  return (
    <div>
      <Jumbotron>
        <div>
          <h1>Photo site for {title}</h1>
          <p>Welcome to the photo-sharing site for the wedding!</p>
          <p>Please log in or sign up to share your photos!</p>
        </div>
      </Jumbotron>
      <Col xs={12} md={8}>
        <ButtonToolbar>
          <Button href="/login" bsSize="large" bsStyle="primary">
            Log in
          </Button>
          <Button href="/signup" bsSize="large">
            Sign up!
          </Button>
        </ButtonToolbar>
      </Col>
    </div>
  )
}
