import React, { useState, useEffect } from 'react';
import Slider from "@mui/material/Slider";

const range = [
  {
    value: 0,
    scaledValue: 0
  },
  {
    value: 1,
    scaledValue: 1
  },
  {
    value: 2,
    scaledValue: 2
  },
  {
    value: 3,
    scaledValue: 3
  },
  {
    value: 4,
    scaledValue: 4
  },
  {
    value: 5,
    scaledValue: 5
  },
  {
    value: 6,
    scaledValue: 6
  },
  {
    value: 7,
    scaledValue: 7
  },
  {
    value: 8,
    scaledValue: 8
  },
  {
    value: 9,
    scaledValue: 9
  },
  {
    value: 10,
    scaledValue: 10
  },
  {
    value: 11,
    scaledValue: 11
  },
  {
    value: 12,
    scaledValue: 12
  },
  {
    value: 13,
    scaledValue: 13
  }
];

export default function RangeSlider({ onextwo }) {
  const [value, setValue] = useState([0, 13]);

  // Reload data from store when refresh etc
  //todo fix shit 
  useEffect(() => {
    const data = window.localStorage.getItem("Range on number of: "+onextwo);
    console.log("this is data"+ data);
    if ( data !== null ) setValue(JSON.parse(data));
  }, []);


  // Set local storage on change of Rangeslider component
  useEffect(()=> {
    //set as min max value directly
    window.localStorage.setItem("Min "+onextwo, JSON.stringify(value[0]));
    window.localStorage.setItem("Max "+onextwo, JSON.stringify(value[1]));
  },[value])
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const divStyle = {
    width: "65%",
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
          marks={range}
          min={0}
          max={13}
          onChange={handleChange}
          onChangeCommitted={() => {
            console.log("min value: "+value[0]+"max value: "+value[1]);
          }}
          valueLabelDisplay="auto"
          aria-labelledby="non-linear-slider"
        />
      </div>
      <div style={{width:"40px"}}>{value[0]} - {value[1]}</div>
      <div style={{width:"50px"}}>({onextwo})</div>
    </div>
    </>
  );
}
