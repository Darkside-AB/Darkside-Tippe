import React, { useState, useEffect } from 'react';
import Slider from "@mui/material/Slider";


export default function ValueBetSlider({ totalValueBets }) {
  const [value, setValue] = useState([27, 41]);

  // Reload data from store when refresh etc
  
  /*

  @todo recalculate to percent
  useEffect(() => {
    const data = window.localStorage.getItem("Min valuebet");
    if ( data !== null ) setValue(JSON.parse(data));
  }, []);
  */

  useEffect(()=> {
    // Count value bets from percentage
    let minValuebet = ((value[0]/100)*totalValueBets);
    let maxValuebet = ((value[1]/100)*totalValueBets);

    window.localStorage.setItem("Min valuebet", minValuebet);
    window.localStorage.setItem("Max valuebet", maxValuebet);
  },[value])
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const divStyle = {
    width: "55%",
    marginLeft: "4%",
    marginRight: "5%",
  };
  return (
    <>
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
      <div style={divStyle}>
        <Slider
          value={value}
          step={1}
          min={0}
          max={100}
          onChange={handleChange}
          onChangeCommitted={() => {
            console.log("min value: "+value[0]+"max value: "+value[1]);
            console.log("hej"+totalValueBets)
          }}
          valueLabelDisplay="auto"
          aria-labelledby="non-linear-slider"
        />
      </div>
      <div style={{width:"80px"}}>{value[0]+" %"} - {value[1]+" %"}</div>
      <div style={{marginLeft:"1%", backgroundColor: "rgb(35, 211, 250)", width: "9px", height: "9px", borderRadius: "100%"}}></div>
    </div>
    </>
  );
}
