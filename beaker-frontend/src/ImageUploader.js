/* eslint-disable no-unused-vars */
import React from 'react'
import { ControlLabel, Panel } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
/* eslint-enable no-unused-vars */

/* globals FileReader */

export default ({avatar, onChange}) => {
  const onDrop = (files) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      onChange(reader.result)
    }, false)
    reader.readAsDataURL(files[0])
  }
  const img = avatar ? <img alt="User Avatar" src={avatar} style={{width: '100px', height: '100px'}}></img> : null
  return (
    <div>
      <ControlLabel>Avatar</ControlLabel>
      <Panel>
        <Dropzone onDrop={onDrop} style={{display: 'flex', flexDirection: 'column'}}>
          {img}
          <p>Try dropping a new image here or click to select a file to upload.</p>
        </Dropzone>
      </Panel>
    </div>
  )
}
