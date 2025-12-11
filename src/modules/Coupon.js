import React, { useEffect, useState} from 'react';
import ButtonGroup from '../components/ButtonGroup';
import RangeSlider from '../components/Sliders/RangeSlider';
import ValueBetSlider from '../components/Sliders/ValueBetSlider';
import RowsToPlaySlider from '../components/Sliders/RowsToPlaySlider';
import { saveAs } from 'file-saver';  

import axios from 'axios';
function Coupon() {

  const [rows, setRows] = React.useState(null); // the lifted state
  const [EventsData, setEventsData] = useState([])
  const apiSvenskaSpelResult = "https://api.spela.svenskaspel.se/draw/1/europatipset/draws/result";
  const apiSvenskaSpelWeeklyCoupon = "https://api.spela.svenskaspel.se/draw/1/europatipset/draws"
  let count = 0;
  const rows1X2 = [];
  let totalValueBets = 0;
  var generatedRows = [];
  let removeRows = [];
  let rowsToExport = [];
  let selectedRows = [];
  let playNumberOfRows = 150;


  const sendDataToCoupon = (numberOfRows) => { // the callback when selectionButton is changed
    setRows(numberOfRows);
  };

  function cartesian(args) {
    var r = [], max = args.length-1;
    function helper(arr, i) {
        for (var j=0, l=args[i].length; j<l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i==max)
                r.push(a);
            else
                helper(a, i+1);
        }
    }
    helper([], 0);
    return r;
  }

  function initRows() {
    selectedRows = [];

    for(let i = 1, s = 0; i<=13; i++, s++){ //@todo const value 13
      generatedRows[s] = [];
      for(let j = 1, t=0; j<=3; j++, t++){
        if(window.localStorage.getItem("button "+i+""+j)>0){
          // Add 1 2 3 (j) of event number (i)
          generatedRows[s][t] = j;
        }
      }
    }
    // Code above adds empty inner rows, remove them
    const filteredGeneratedRows = generatedRows.map((innerArray) => innerArray.filter((element) => element > 0));   
    // Take created Matrix e.g [[1, 2, 3], [1, 2], [1, 2, 3], [1], [1, 2, 3]];
      // Generate an array with all combinations of rows from Matrix.
    selectedRows = cartesian(filteredGeneratedRows);
    removeRowsRangeMinMax1X2(selectedRows)      
  }

  function removeRowsRangeMinMax1X2(selectedRows) {
    console.log("removeRowsRangeMinMax1X2");

    let reduce_1_min_slider = window.localStorage.getItem("Min 1");
    let reduce_1_max_slider = window.localStorage.getItem("Max 1");
    let reduce_X_min_slider = window.localStorage.getItem("Min x");
    let reduce_X_max_slider = window.localStorage.getItem("Max x");
    let reduce_2_min_slider = window.localStorage.getItem("Min 2");
    let reduce_2_max_slider = window.localStorage.getItem("Max 2");

    console.log("Min max 1: "+reduce_1_min_slider+""+reduce_1_max_slider);
    console.log("Min max X: "+reduce_X_min_slider+""+reduce_X_max_slider);
    console.log("Min max 2: "+reduce_2_min_slider+""+reduce_2_max_slider);

    console.log("Rows before reducing");
    console.log(selectedRows);
  
    removeRows = [];

    rowsToRemove("1", reduce_1_min_slider, reduce_1_max_slider, selectedRows, removeRows);
    rowsToRemove("2", reduce_X_min_slider, reduce_X_max_slider, selectedRows, removeRows);
    rowsToRemove("3", reduce_2_min_slider, reduce_2_max_slider, selectedRows, removeRows);
    
    console.log("Rows to remove");
    console.log(removeRows);

    //Remove from original arrays with rows
    selectedRows = selectedRows.filter( ( el ) => !removeRows.includes( el ) );
    console.log("Rows after reducing");
    console.log(selectedRows);
    setRows(selectedRows.length);

    //Remove rows outside Min Max value bet range
    let minValueBet = window.localStorage.getItem("Min valuebet");
    let maxValueBet = window.localStorage.getItem("Max valuebet");

    removeRows = [];

    rowsToRemoveValueBet(minValueBet, maxValueBet, selectedRows, removeRows);

    console.log("remove: ");
    console.log(removeRows);

    //Remove from original arrays with rows
    selectedRows = selectedRows.filter( ( el ) => !removeRows.includes( el ) );
    console.log("Rows after reducing");
    console.log(selectedRows);
    setRows(selectedRows.length);

    
    // Remove later, keep 100 rows
    for(var i = selectedRows.length-1;i>=playNumberOfRows;i--){
      selectedRows.splice(Math.floor(Math.random()*selectedRows.length), 1);
    }

    // Remove out later/////

    let game = "Stryktipset";

    // ADD E, before every row
    selectedRows = selectedRows.map(i => 'E,' + i);

    // Replace 2 with X and 3 with 2 
    selectedRows = selectedRows.map(item => item.replace(/2/g, 'X'));
    selectedRows = selectedRows.map(item => item.replace(/3/g, '2'));

    console.log("export rows");
    console.log(selectedRows);

    var blob = new Blob([game + "\n" + selectedRows.join("\n")], {
      type: "text/plain;charset=utf-8"
    });

    saveAs(blob, "stryket.txt");

    ////////
  }
  function rowsToRemove(oneXTwo, minValue, maxValue, selectedRows, removeRows) {
    for (let p = 0; p < selectedRows.length; p++) {
      let count = 0;
      for (let i = 0; i < selectedRows[p].length; i++) {
          if (selectedRows[p][i] == oneXTwo) {
              count++;
          }
      }
      // check min max and check that rows hasn't been added before to removeRows
      //if (count > maxValue || count < minValue && removeRows.find(v => removeRows.includes(rows[p])==null)) {
      if (count > maxValue || count < minValue && !removeRows.indexOf(selectedRows[p])) {
          removeRows.push(selectedRows[p]);
      }
  }
  }
  function rowsToRemoveValueBet(minValueBet, maxValueBet, selectedRows, removeRows){
    // Loop through all selected rows
    for (let p = 0; p < selectedRows.length; p++) {
      let count = 0;
      // Loop through all 1 2 3 (1 x 2) and see if valuebet comparing to button local storage
      for (let i = 0, j = 1; i < selectedRows[p].length; i++, j++) {
        if(window.localStorage.getItem("button "+j+""+selectedRows[p][i]+" valuebet")=="true"){
            count++;
        }
      }
      //console.log("Row: "+selectedRows[p]+" has "+count+" value bets");
      if (count > maxValueBet || count < minValueBet) {
        removeRows.push(selectedRows[p]);
      }

    }
  }
  
  function writeToFile() {
    let game = "Stryktipset";

    // ADD E, before every row
    //rowsToExport = rowsToExport.map(i => 'E,' + i);

    console.log("export rows");
    console.log(selectedRows);

    var blob = new Blob([game + "\n" + selectedRows.join("\n")], {
      type: "text/plain;charset=utf-8"
    });

    saveAs(blob, "stryket.txt");
}

  function checkIfValueBet(eventNumber, currentodds, currentsvf) {  
    currentodds = currentodds.replaceAll(",", ".");
    let dodds = parseFloat(currentodds);
    //console.log("dOdds"+ dodds );
    let repaymentRate = 0.95;
    var oddstoPercent = ((repaymentRate / dodds) * 100);
    //console.log("Event: "+eventNumber+ " SVspel: " + currentsvf+ ": odds: " + oddstoPercent );
    //let oddsint = Math.round(oddstoPercent);
    if (oddstoPercent >= currentsvf) {
      totalValueBets++;
      return true;
    }
    else{
      return false;
    }
  }

  useEffect(()=>{
    /*
    axios.get("http://localhost:5000/api/europatipset")
  .then(res => console.log(res.data));
  */
    console.log("Im here 1")
    axios.get("http://localhost:5000/api/europatipset")
  .then(res =>{
          setEventsData(res.data.draws[0].drawEvents);
          console.log('Response from main API: ',res.data.draws[0].drawEvents)
        })
        .catch(err=>{
          console.log("Im here 2")
            console.log(err);
        })
},[])

  let events=['1','2','3','4','5','6','7','8','9','10','11','12','13'];
  let countEvents = 0;
  let eventList=EventsData.map((event)=>{
    countEvents++;
    return <li key={event}>
      <div style={{display: "flex", flexDirection: "row",  justifyContent:'center', alignItems:'center'}}>
      <h4 style={{width: "150px"}}>
        {countEvents+". "+event.eventDescription}<br></br>
        {event.svenskaFolket ? "People: "+event.svenskaFolket.one+"% "+event.svenskaFolket.x+"% "+event.svenskaFolket.two+"%" : " odds not available"}<br></br>
        {event.odds ? "Odds: "+event.odds.one+" "+event.odds.x+" "+event.odds.two : " odds not available"}
        </h4>
      <ButtonGroup
        number = {JSON.stringify(event.eventNumber)} 
        sendDataToCoupon={sendDataToCoupon}
      
        isValueBet1 = {event.odds ? checkIfValueBet(event.eventNumber, event.odds.one, event.svenskaFolket.one) :"X"}
        isValueBetX = {event.odds ? checkIfValueBet(event.eventNumber, event.odds.x, event.svenskaFolket.x): "X"}
        isValueBet2 = {event.odds ? checkIfValueBet(event.eventNumber, event.odds.two, event.svenskaFolket.two): "X"}
        />
      </div>
      ----------------------------------------
      </li>
  })
  
  return (
    <div style={{ display: "flex", flexDirection: "column",  justifyContent:'center', alignItems:'center'}}>
      <br></br>
      <ul style={{fontSize: "14px", justifyContent: "center"}}>
      <li style={{padding: "3px", backgroundColor: "rgb(229, 229, 229)"}}><font style={{marginLeft:"2%"}}>Remaining playable rows based on your system: {rows}</font></li>
      <br></br>
        <li >{eventList}</li>
        <br></br>
        <li style={{padding: "3px", backgroundColor: "rgb(229, 229, 229)"}}><font style={{marginLeft:"2%"}}>Range of 1 X 2</font></li>
        <li><RangeSlider onextwo = "1"/></li>
        <li><RangeSlider onextwo = "x"/></li>
        <li><RangeSlider onextwo = "2"/></li>
        <li><button style={{marginBottom: "16px", backgroundColor: "green", borderRadius: '6px', border: '1px solid', borderColor: 'grey', color: 'white', padding: '4px 8px' }} onClick={() => initRows()}>Set Range 1 X 2</button></li>
        <li style={{padding: "3px", backgroundColor: "rgb(229, 229, 229)"}}><font style={{marginLeft:"2%"}}>{"Range of value bets  (total value bets is "+totalValueBets+")"}</font></li>
        <li>
          <ValueBetSlider totalValueBets={totalValueBets}/>
        </li>
        <li><RowsToPlaySlider maxRows = {rows} /></li>
        <br></br>
        <li><button style={{marginBottom: "16px", backgroundColor: "green", borderRadius: '6px', border: '1px solid', borderColor: 'grey', color: 'white', padding: '6px 8px' }} onClick={() => writeToFile()}>Reduce and weight based on {rows}</button></li>
      </ul>
    </div>
    
  );
}

export default Coupon
