import React from 'react'
import { FormGroup, FormControl, ControlLabel, Button, ButtonToolbar } from 'react-bootstrap'
import ImageUploader from './ImageUploader'

export default ({editUser, onChange, onSave, onCancel}) => {
  if (editUser === null) return (<h3>Click row to edit</h3>)

  return (
    <form>
      <FormGroup>
        <ControlLabel>First name</ControlLabel>
        <FormControl
          type="text"
          value={editUser.FirstName}
          placeholder="Enter text"
          onChange={(e) => onChange('FirstName', e.target.value)}
        />
        <ControlLabel>Last name</ControlLabel>
        <FormControl
          type="text"
          value={editUser.LastName}
          placeholder="Enter text"
          onChange={(e) => onChange('LastName', e.target.value)}
        />
        <ControlLabel>Email</ControlLabel>
        <FormControl
          type="text"
          value={editUser.Email}
          placeholder="Enter text"
          onChange={(e) => onChange('Email', e.target.value)}
        />
        <ControlLabel>Address</ControlLabel>
        <FormControl
          type="text"
          value={editUser.Address}
          placeholder="Enter text"
          onChange={(e) => onChange('Address', e.target.value)}
        />
        <ControlLabel>City</ControlLabel>
        <FormControl
          type="text"
          value={editUser.City}
          placeholder="Enter text"
          onChange={(e) => onChange('City', e.target.value)}
        />
        <ImageUploader avatar={editUser.Avatar} onChange={(data) => onChange('Avatar', data)} />
        <FormControl.Feedback />
        <ButtonToolbar>
          <Button bsSize="large" bsStyle="primary" onClick={onSave}>Save</Button>
          <Button bsSize="large" onClick={onCancel}>Cancel</Button>
        </ButtonToolbar>
      </FormGroup>
    </form>
  )
}
