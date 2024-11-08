import { Button, TextField } from "@mui/material";
import React from "react";

function AdminSearch() {
  return (
    <div>
      <div>Admin</div>
      <br/>
      <div style={{display: "flex",flexDirection:"column"}}>
      <TextField id="outlined-multiline-flexible" label="Search any song..." />
      <br/>
      <Button variant="contained">Search</Button>
        
      </div>
    </div>
  );
}

export default AdminSearch;
