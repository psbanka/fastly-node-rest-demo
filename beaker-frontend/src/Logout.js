/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
/* eslint-enable no-unused-vars */

export default () => {
  const instance = axios.create()
  instance.defaults.headers.common['Content-Type'] = 'application/json'
  instance.defaults.headers.get['Content-Type'] = 'application/json'
  instance.defaults.headers.post['Content-Type'] = 'application/json'
  instance.get('/api/logout')
    .then(() => {
      console.log('LOGGED OUT')
    })
  return (
    <div>
      <h2>Logout</h2>
    </div>
  )
}
