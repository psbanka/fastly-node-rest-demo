import React from 'react'
import { Alert } from 'react-bootstrap'

export default ({errors, handleAlertDismiss}) => {
  if (errors.length === 0) return null
  const messages = errors.map((error) => {
    return (
      <p><strong>Error:</strong>{error}</p>
    )
  })
  return (
    <Alert bsStyle="warning" onDismiss={handleAlertDismiss}>
      {messages}
    </Alert>
  )
}
