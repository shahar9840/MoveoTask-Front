import { Autocomplete, Button, createFilterOptions, TextField } from "@mui/material";
import React from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";
import config from "../Config";



const filter = createFilterOptions();

function AdminSearch({ token ,handleSearch,setValue,value}) {
  const navigate = useNavigate();
  const [songs, setSongs] = React.useState([]);


// Fetch songs
  React.useEffect(() => {
    axios.get(`${config.apiUrl}/get_songs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((response) => {


      if (Array.isArray(response.data)) {
        setSongs(response.data);
      } else {


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
