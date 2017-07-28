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
          onChange={() => onChange(user)}
        />
        <ControlLabel>Last name</ControlLabel>
        <FormControl
          type="text"
          value={user.LastName}
          placeholder="Enter text"
          onChange={() => onChange(user)}
        />
        <ControlLabel>Address</ControlLabel>
        <FormControl
          type="text"
          value={user.Address}
          placeholder="Enter text"
          onChange={() => onChange(user)}
        />
        <ControlLabel>City</ControlLabel>
        <FormControl
          type="text"
          value={user.City}
          placeholder="Enter text"
          onChange={() => onChange(user)}
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
