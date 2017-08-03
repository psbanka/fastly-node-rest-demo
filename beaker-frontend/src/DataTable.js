import React from 'react'
import { Table, Pagination } from 'react-bootstrap'

/**
 * Pages are zero-indexed on server and 1-indexed on UI
 */
export default ({users, onClick, currentPage, totalPages, changePage}) => {
  if (!users.length) return (<h2>Loading...</h2>)

  const output = users.map((user, i) => {
    return (
      <tr onClick={() => onClick(i)}>
        <td key={user.id}>{user.attributes.FirstName}</td>
        <td>{user.attributes.LastName}</td>
        <td>{user.attributes.Email}</td>
        <td>{user.attributes.Address}</td>
        <td>{user.attributes.City}</td>
        <td><img alt="User Avatar" src={user.attributes.Avatar} className='App-avatar'></img></td>
      </tr>
    )
  })

  return (
    <div>
      <Pagination
        bsSize="small"
        items={totalPages}
        activePage={currentPage + 1}
        onSelect={(pageNumber) => changePage(pageNumber - 1)}
      />
      <Table>
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
            <th>Address</th>
            <th>City</th>
            <th>Avatar</th>
          </tr>
        </thead>
        <tbody>
          {output}
        </tbody>
      </Table>
    </div>
  )
}
