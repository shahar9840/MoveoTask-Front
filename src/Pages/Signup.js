import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [checkPassword, setCheckPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const instrument = [
    "Singer",
    "Guitar",
    "Piano",
    "Drums",
    "Flute",
    "Saxophone",
    "Violin",
  ];
  const [instrumentSelected, setInstrumentSelected] = React.useState("");

  const handleChange = (event) => {

    setInstrumentSelected(event.target.value);
  };
  const signup = () => {
    console.log("username", username,"password", password,"checkPassword", checkPassword,'name', name, 'instrument',instrumentSelected);
    if (password !== checkPassword) {
      alert("Passwords do not match");
      return;
    } else {
      axios
        .post("http://localhost:50000/create_user", {
          username,
          password,
          name,
          instrument:instrumentSelected,
        })
        .finally((response) => {
          console.log(response);
        });
    }
  };

  return (
    <div>
        <div 
        style={{
            textAlign: "right",
          }}>
      
      <Button onClick={() => navigate("/login")} variant="contained" size="small">Login</Button>

        </div>
      <div className="login">
      <h2 >Signup</h2>
        <TextField fullWidth id="filled-basic" label="Name" variant="filled" onChange={(e) => setName(e.target.value)} />
        <br></br>
        <TextField
        onChange = {(e) => setUsername(e.target.value)}
          fullWidth
          id="filled-basic"
          label="Username"
          variant="filled"
        />
        <br></br>
        <TextField
        onChange={(e) => setPassword(e.target.value)}
          fullWidth
          id="filled-basic"
          label="password"
          type="password"
          variant="filled"
        />
        <br></br>
        <TextField
        onChange={(e) => setCheckPassword(e.target.value)}
          fullWidth
          id="filled-basic"
          label="confirm password"
          type="password"
          variant="filled"
        />
        <br></br>
        <FormControl variant="filled" fullWidth>
          <InputLabel id="demo-simple-select-filled-label">
            Instrument
          </InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={instrumentSelected}
            onChange={handleChange}
            label="Instrument"
          >
            {instrument.map((instrument) => (
              <MenuItem  value={instrument}>{instrument}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <br></br>
        <Button variant="outlined" onClick={signup}>
          Signup
        </Button>
      </div>
    </div>
  );
}

export default Signup;
