import { Autocomplete, Button, createFilterOptions, TextField } from "@mui/material";
import React from "react";

import axios from "axios";
import Result from "./Result";
import { useNavigate } from "react-router-dom";



const filter = createFilterOptions();

function AdminSearch({ token ,handleSearch,setValue,value}) {
  const navigate = useNavigate();
  const [songs, setSongs] = React.useState([]);








  React.useEffect(() => {
    axios.get("http://localhost:50000/get_songs", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((response) => {

      console.log('hsfshsf',response.data);
      if (Array.isArray(response.data)) {
        setSongs(response.data);
      } else {
        console.error("Response data is not an array:", response.data);

        setSongs([]);;
      }
    });
  }, []);
  

  return (
    <div>
      <div>Admin</div>
      <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          setValue({
            title: newValue,
            artist: "",
          });
        } else if (newValue && newValue.inputValue) {
          setValue({
            title: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;
        
        
        return filtered;

      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={songs}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.title;
      }}
      renderOption={(props, option) => {
        const {key,...optionsProps} = props;
       return(
        <li key={key} {...optionsProps} style={{ display: 'flex', alignItems: 'center' }}>
        {option.picture ? (
          <img
            src={option.picture}
            alt={`${option.title} cover`}
            style={{ width: '30px', height: '30px', marginRight: '10px' }}
          />
        ) : null}
        <span>{`${option.title} - ${option.artist}`}</span>
      </li>
      ) }}
      sx={{ width: "100%" }}
      freeSolo
      renderInput={(params) => (
        <div style={{display: "flex",flexDirection:"column"}}>

      <TextField {...params} id="outlined-multiline-flexible" label="Search any song..." />
      <br/>
      <Button variant="contained" onClick={() => handleSearch()}>Search</Button>

        
      </div>
      )}
      />
      <br/>
      <div>
          
          
      </div>
      
    </div>
  );
}

export default AdminSearch;
