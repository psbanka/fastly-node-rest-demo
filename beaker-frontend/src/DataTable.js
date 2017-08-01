import React from 'react'
import { Table } from 'react-bootstrap'

export default ({users, onClick}) => {
  if (!users) return (<h2>Loading...</h2>)

  const output = users.map((user) => {
    return (
      <tr onClick={() => onClick(user.ID - 1)}>
        <td key={user.ID}>{user.FirstName}</td>
        <td>{user.LastName}</td>
        <td>{user.Email}</td>
        <td>{user.Address}</td>
        <td>{user.City}</td>
        <td><img alt="User Avatar" src={user.Avatar} className='App-avatar'></img></td>
      </tr>
    )
  })

  return (
    <Table>
      <thead>
        <tr>
          <th>First name</th>
          <th>Last name</th>
          <th>email</th>
          <th>address</th>
          <th>city</th>
          <th>avatar</th>
        </tr>
      </thead>
      <tbody>
        {output}
      </tbody>
    </Table>
  )
}
