import TextField from "@mui/material/TextField";

import { useState } from "react";

export default function RowsToPlaySlider() {
  const [name, setName] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <TextField
              label="Rows to play"
              onChange={handleChange}
              value={name}
              name="Rows to play"
              type="text"
              placeholder="Rows to play"
            
    />
  );
}