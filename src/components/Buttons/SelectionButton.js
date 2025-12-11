import React, { useState, useEffect } from 'react';
import "../../styles.css";
import styled from "styled-components";
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';

const Button = styled.button`
    background-color: black;
    color: white;
    font-size: 14px;
    border-radius: 5px;
    margin: 5px 5px 5px 5px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    text-align: center;
  `;

const SelectionButton = ({ isValueBet, number, event, sendDataWeightingToButtonGroup, sendtotalRowsToButtonGroup }) => {

  
  let [state, setState] = useState(0);
  let buttonText;
  //let percentage;
  

  useEffect(() => {
    const data = window.localStorage.getItem("button "+number);
    if ( data !== null ) setState(JSON.parse(data));
  }, []);

  // Set button state and 
  useEffect(()=> {
window.localStorage.setItem("button "+number, JSON.stringify(state))
window.localStorage.setItem("button "+number+" valuebet", JSON.stringify(isValueBet))

  },[state])

  useEffect(() => {
    const eventData = number.slice(0, -1);
    const home = window.localStorage.getItem("button "+eventData+1);
    const equal = window.localStorage.getItem("button "+eventData+2);
    const away = window.localStorage.getItem("button "+eventData+3);
    const x = 100/6;
    let homeValue = home * x;
    let equalValue = equal * x;
    let awayValue = away * x;
    let sum = homeValue+equalValue+awayValue;
    let homeValuePercent = (homeValue/sum)*100;
    let equalValuePercent = (equalValue/sum)*100;
    let awaylValuePercent = (awayValue/sum)*100;
    
    sendDataWeightingToButtonGroup(homeValuePercent.toFixed(0)+" "+equalValuePercent.toFixed(0)+" "+awaylValuePercent.toFixed(0));

    //count all rows
    let sumOfAllRows = 1;
    let playableButtons = 0;
    for(let i = 1; i<=13; i++){ //@todo const value 13
      playableButtons = 0;
      for(let j = 1; j<=3; j++){
        if(window.localStorage.getItem("button "+i+""+j)>0){
          playableButtons = playableButtons + 1;
        }
      }
      sumOfAllRows=sumOfAllRows*playableButtons;
      sendtotalRowsToButtonGroup(sumOfAllRows);
    }

  }, [state]);

  function betterToggleState() {
    if(state===0){
      setState((prevState) => (prevState+7));
    }
    setState((prevState) => (prevState - 1));

  }
  let colortoshow;
  if (state === 6) {
    colortoshow = "green";
    buttonText = "A";
  } else if (state === 5) {
    colortoshow = "#add633";
    buttonText = "B";
  } else if (state === 4) {
    colortoshow = "#ffd934";
    buttonText = "C";
  } else if (state === 3) {
    colortoshow = "#ffb234";
    buttonText = "D";
  } else if (state === 2) {
    colortoshow = "#ff8c5a";
    buttonText = "E";
  } else if (state === 1) {
    colortoshow = "#990000";
    buttonText = "F";
  } else {
    colortoshow = "grey";
    buttonText = "-";
  }


  return (
    
    <div className="selectionButton">
      
      <Button key={"button "+ number} value="33"
        onClick={betterToggleState}
        style={{
          backgroundColor: colortoshow
        }}
      >
        {isValueBet &&<div style={{marginLeft:"65%", textAlign: "right", backgroundColor: "rgb(35, 211, 250)", width: "7px", height: "7px", borderRadius: "100%"}}></div>}
        {!isValueBet &&<div style={{marginLeft:"65%", textAlign: "right", backgroundColor: colortoshow, width: "7px", height: "7px", borderRadius: "100%"}}></div>}
        <div style={{justifyContent: "center"}}>
        {buttonText}
        </div>
      </Button>
      
    </div>
    
  )
}

export default SelectionButton
