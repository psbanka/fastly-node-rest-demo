import React from 'react'
import { FormGroup, FormControl, ControlLabel, HelpBlock, Panel } from 'react-bootstrap'

export default ({users, userId, onChange}) => {
  if (!userId) return (<h1>Details!</h1>)

  const user = users[userId]
  const imgSrc = `data:image/jpeg;base64,${user.Avatar}`
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
        <ControlLabel>Avatar</ControlLabel>
        <Panel>
          <img alt="Embedded Image" src={imgSrc} className='App-avatar'></img>
        </Panel>
        <FormControl.Feedback />
        <HelpBlock>Changes are saved immediately to the server.</HelpBlock>
      </FormGroup>
    </form>
  )
}
