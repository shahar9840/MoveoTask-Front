import { Button, Link, TextField } from "@mui/material";
import React from "react";
import "../App.css";
import axios from "axios";
import config from "../Config";

function Login({token,username,setUsername,password,setPassword,navigate}) {

  const login = () => {

    axios.post(`${config.apiUrl}/login`, {   
      username,
      password
        
    }).then((response) => {

      localStorage.setItem("is_logged_in", true);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      navigate("/");
      
      
    
    

    }).catch((error) => {
      console.log('error:',error);
      alert("Wrong username or password");  

    })
    ;
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
         
        </div>
        <Button onClick={() => navigate("/signup")} variant="contained" size="small">
          
            Signup
         
        </Button>
      </div>

      <div className="login">
      <h2>Login</h2>
        <TextField
          onChange={(e) => setUsername(e.target.value)}
          id="filled-basic"
          label="Username"
          variant="filled"
        />
        <br></br>
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          id="filled-basic"
          label="password"
          type="password"
          variant="filled"
        />
        <br></br>
        <Button  onClick={login} variant="outlined">Login</Button>
      </div>
    </div>
  );
}

export default Login;
