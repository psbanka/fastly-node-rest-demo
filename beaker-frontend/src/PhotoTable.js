/* eslint-disable no-unused-vars */
import React from 'react'
import { Table } from 'react-bootstrap'
/* eslint-enable no-unused-vars */

export default ({photos, loading}) => {
  if (loading) return (<h2>Loading...</h2>)
  if (photos.length === 0) return (<h2>You haven't uploaded any photos yet!</h2>)

  const onClick = () => console.log('clicked')

  const output = photos.map((photo, i) => {
    return (
      <tr key={photo.attributes.ID} onClick={() => onClick(i)}>
        <td><img src={photo.attributes.Photo} className='App-avatar'></img></td>
      </tr>
    )
  })

  return (
    <div>
      <Table>
        <tbody>
          {output}
        </tbody>
      </Table>
    </div>
  )
}
