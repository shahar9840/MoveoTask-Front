import { Button, Link, TextField } from "@mui/material";
import React from "react";
import "../App.css";
import axios from "axios";

function Login({token,username,setUsername,password,setPassword,navigate}) {

  const login = () => {
    console.log("username", username, "password", password);
    axios.post("http://localhost:50000/login", {   
      username,
      password
        
    }).then((response) => {
      console.log('response:',response);
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
          <h2>Login</h2>
        </div>
        <Button variant="contained" size="small">
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            href="/signup"
          >
            Signup
          </Link>
        </Button>
      </div>

      <div className="login">
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
