import React from 'react'
import ButtonGroup from './ButtonGroup'



const Event = ({ number }) => {
  return (
    <div style={{ display: "inline"}}>
        <table>
        <tbody>
            <tr>
                <td>Event Number {number}</td>
                <td><ButtonGroup number = {number}/>
                </td>
            </tr>
        </tbody>
        </table>
        
    </div>
  )
}

export default Event
