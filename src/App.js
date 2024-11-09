import logo from './logo.svg';
import React from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import axios from 'axios';
import Result from './Components/Result';
import { io } from 'socket.io-client';
import { Button } from '@mui/material';
import config from './Config';

function App() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const token = localStorage.getItem("access_token");
  const isLoggedIn = localStorage.getItem('is_logged_in');
  const refreshToken = localStorage.getItem("refresh_token");
  const socket = io(`${config.apiUrl}`);
  const [start,setStart]=React.useState(false);  
  const navigate = useNavigate();



  React.useEffect(() => {
    if (start === true) {
      socket.on("user_connected", (data) => {
        socket.emit("user_connected", {"check":"check"})
  
      })
      
    }

   }, [start]);

  React.useEffect(() => {
    if (token) {
      axios.get(`${config.apiUrl}/check_token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {

        console.log("Response:", response.data.user);
        if (response.data.user === username) {
          localStorage.setItem("is_logged_in", true);
          

        }
      })
      .catch((error) => {
        console.error("Error checking token:", error);
        if (error.response && error.response.status === 401) {
          localStorage.setItem("is_logged_in", false);
          localStorage.removeItem("access_token");
          navigate("/login");
        }
      });
    } else {
      console.warn("No token available");
      navigate("/login");
    }
  }, [token]);
    
      
  const checkToken = () => {
    if (token && token !== "" && token !== undefined && token !== null) {
      axios.get(`${config.apiUrl}/check_token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        console.log("Response:", response);
        if (response.data.user === username) {
          return true
        }else{
          localStorage.setItem("is_logged_in", false);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
        }
      }).catch((error) => {
        console.error("Error checking token:", error);
        console.error("Response data:", error.response.data);
        console.error("Status code:", error.response.status);
        navigate("/login");
      })   
      ;
        }
    }
  
  
  return (
    <div className="App">
      <div style={{fontSize:"8vh", fontFamily:"cursive"}}>JaMoveo</div>

      
      <Routes>
        <Route path="/" element={<Home token={token} socket={socket} checkToken={checkToken}/>} />
        <Route path="/login" element={<Login token={token} username={username} setUsername={setUsername} password={password} setPassword={setPassword} navigate={navigate}/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </div>
  );
}

export default App;
