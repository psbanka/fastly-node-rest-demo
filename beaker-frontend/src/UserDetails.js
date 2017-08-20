/* eslint-disable no-unused-vars */
import React from 'react'
import { FormGroup, FormControl, ControlLabel, Button, ButtonToolbar } from 'react-bootstrap'
import ImageUploader from './ImageUploader'
/* eslint-enable no-unused-vars */

export default ({editUser, onChange, onSave, onCancel, saving}) => {
  if (editUser === null) return (<h3>Click a row to edit</h3>)
  const saveText = saving ? 'Saving...' : 'Save'

  return (
    <form>
      <FormGroup>
        <ControlLabel>First name</ControlLabel>
        <FormControl
          type="text"
          disabled={saving}
          value={editUser.attributes.FirstName}
          placeholder="Enter text"
          onChange={(e) => onChange('FirstName', e.target.value)}
        />
        <ControlLabel>Last name</ControlLabel>
        <FormControl
          type="text"
          disabled={saving}
          value={editUser.attributes.LastName}
          placeholder="Enter text"
          onChange={(e) => onChange('LastName', e.target.value)}
        />
        <ControlLabel>Email</ControlLabel>
        <FormControl
          type="text"
          disabled={saving}
          value={editUser.attributes.Email}
          placeholder="Enter text"
          onChange={(e) => onChange('Email', e.target.value)}
        />
        <ControlLabel>Address</ControlLabel>
        <FormControl
          type="text"
          disabled={saving}
          value={editUser.attributes.Address}
          placeholder="Enter text"
          onChange={(e) => onChange('Address', e.target.value)}
        />
        <ControlLabel>City</ControlLabel>
        <FormControl
          type="text"
          disabled={saving}
          value={editUser.attributes.City}
          placeholder="Enter text"
          onChange={(e) => onChange('City', e.target.value)}
        />
        <ControlLabel>Password</ControlLabel>
        <FormControl
          type="password"
          disabled={saving}
          value={editUser.attributes.Password}
          placeholder="Enter password"
          onChange={(e) => onChange('Password', e.target.value)}
        />
        <ImageUploader avatar={editUser.attributes.Avatar} onChange={(data) => onChange('Avatar', data)} />
        <FormControl.Feedback />
        <ButtonToolbar>
          <Button type="submit" disabled={saving} bsSize="large" bsStyle="primary" onClick={onSave}>
            {saveText}
          </Button>
          <Button disabled={saving} bsSize="large" onClick={onCancel}>Cancel</Button>
        </ButtonToolbar>
      </FormGroup>
    </form>
  )
}
