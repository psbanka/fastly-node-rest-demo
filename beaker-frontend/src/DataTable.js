import React from 'react'
import { Table } from 'react-bootstrap'

export default ({users, onClick}) => {
  if (!users) return (<h2>Loading...</h2>)

  const output = users.map((user) => {
    const imgSrc = `data:image/jpeg;base64,${user.Avatar}`
    return (
      <tr onClick={() => onClick(user.ID)}>
        <td key={user.ID}>{user.FirstName}</td>
        <td>{user.LastName}</td>
        <td>{user.Address}</td>
        <td>{user.City}</td>
        <td><img alt="Embedded Image" src={imgSrc} className='App-avatar'></img></td>
      </tr>
    )
  })

  return (
    <Table>
      <thead>
        <th>First name</th>
        <th>Last name</th>
        <th>address</th>
        <th>city</th>
        <th>avatar</th>
      </thead>
      <tbody>
        {output}
      </tbody>
    </Table>
  )
}
