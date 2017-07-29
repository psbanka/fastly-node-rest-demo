import React from 'react'
import { FormGroup, FormControl, ControlLabel, HelpBlock, Panel } from 'react-bootstrap'
import ImageUploader from './ImageUploader'

export default ({users, userId, onChange}) => {
  if (userId === null) return (<h1>Details!</h1>)

  const user = users[userId]
  return (
    <form>
      <FormGroup>
        <ControlLabel>First name</ControlLabel>
        <FormControl
          type="text"
          value={user.FirstName}
          placeholder="Enter text"
          onChange={(e) => onChange(user, 'firstName', e.target.value)}
        />
        <ControlLabel>Last name</ControlLabel>
        <FormControl
          type="text"
          value={user.LastName}
          placeholder="Enter text"
          onChange={(e) => onChange(user, 'LastName', e.target.value)}
        />
        <ControlLabel>Address</ControlLabel>
        <FormControl
          type="text"
          value={user.Address}
          placeholder="Enter text"
          onChange={(e) => onChange(user, 'Address', e.target.value)}
        />
        <ControlLabel>City</ControlLabel>
        <FormControl
          type="text"
          value={user.City}
          placeholder="Enter text"
          onChange={(e) => onChange(user, 'City', e.target.value)}
        />
        <ImageUploader avatar={user.Avatar} onChange={(data) => onChange(user, 'Avatar', data)} />
        <FormControl.Feedback />
        <HelpBlock>Changes are saved immediately to the server.</HelpBlock>
      </FormGroup>
    </form>
  )
}
