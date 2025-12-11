import React from 'react'
import SelectionButton from './Buttons/SelectionButton'

const ButtonGroup = ({ isValueBet1, isValueBetX, isValueBet2, number, sendDataToCoupon }) => {

  const [weightPercent, setWeightPercent] = React.useState(null); // the lifted state

  const sendDataWeightingToButtonGroup = (weightPercent) => { // the callback. Use a better name
    setWeightPercent(weightPercent);
    sendDataToCoupon(weightPercent);
  };

  const [totalRows, setTotalRows] = React.useState(null); // the lifted state

  const sendtotalRowsToButtonGroup = (totalRows) => { // the callback. Use a better name
    setTotalRows(totalRows);
    sendDataToCoupon(totalRows);
  };
  
  return (
    <div style={{ display: "flex", flexDirection: "row",  justifyContent:'center', alignItems:'center'}}>
     
      <SelectionButton isValueBet={isValueBet1} event = {number} number = {number+1} 
      sendtotalRowsToButtonGroup = {sendtotalRowsToButtonGroup} sendDataWeightingToButtonGroup={sendDataWeightingToButtonGroup}/> 

      <SelectionButton isValueBet={isValueBetX} event = {number} number = {number+2} 
      sendtotalRowsToButtonGroup = {sendtotalRowsToButtonGroup} sendDataWeightingToButtonGroup={sendDataWeightingToButtonGroup}/>

      <SelectionButton isValueBet={isValueBet2} event = {number} number = {number+3} 
      sendtotalRowsToButtonGroup = {sendtotalRowsToButtonGroup} sendDataWeightingToButtonGroup={sendDataWeightingToButtonGroup}/>
      <div style={{width: "80px", display: "flex", flexDirection: "row",  justifyContent:'center', alignItems:'center'}}>
      <h1>{weightPercent == "NaN NaN NaN" ? "" : weightPercent}</h1>
      </div>
    </div>
  )
}

export default ButtonGroup
