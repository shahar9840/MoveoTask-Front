import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSearch from "../Components/AdminSearch";
import Player from "../Components/Player";
import Result from "../Components/Result";
import { io } from "socket.io-client";
import config from "../Config";


function Home({ token , setToken}) {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(null);
  const [chosenSong, setChosenSong] = React.useState(null);
  const [admin, setAdmin] = React.useState(false);
 
//  socket connection
  const socket = io(config.apiUrl , {
    transports: ['websocket'],  
    reconnectionAttempts: 5     
  });
  const socketRef = React.useRef(null);



  React.useEffect(() => {
    if (!token) return
    socketRef.current = io(`${config.apiUrl}`, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      autoConnect: true,
    });
    socketRef.current.emit("user_connected", chosenSong)
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      }
  },[chosenSong,socketRef]);

// check if user is admin
  React.useEffect(() => {
    if (token) {
      setAdmin(isAdmin());
    }
  }, [token]);

  const isAdmin = () => {
    axios
      .get(`${config.apiUrl}/is_admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {

        setAdmin(response.data.is_admin);
        return response.data.is_admin;
      });
  };
// handle logout
  const handleLogout = () => {
    localStorage.setItem("is_logged_in", false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };
// handle search
  const handleSearch = () => {

    setChosenSong(value);
  };
  const handelPlayer = () => {
      socket.emit("user_connected", {"chosenSong": chosenSong,"check":"check"})
  }
// handle back
  const handleBack = () => {
    setChosenSong(null);
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection:"row-reverse",
          textAlign: "right",
          padding: "10px",
          '@media (maxWidth: 600px)': {
            textAlign: "center",
            padding: "5px",
          },
        }}
      >
        <Button
          variant="contained"
          size="small"
          onClick={handleLogout} 
        >
          Logout
        </Button>
        {chosenSong?<Button variant="contained" size="small" onClick={handleBack}>Quit</Button>:<></>}
        
      </div>

      {!admin ? (
        <div>
          <Player chosenSong={chosenSong} token={token} />
        </div>
      ) : chosenSong ? (
        <Result admin={admin} chosenSong={chosenSong} />
      ) : (
        <div
          style={{
            padding: "20px",
            '@media (maxWidth: 600px)': {
              padding: "10px",
            },
          }}
        >
          <AdminSearch

            token={token}
            handleSearch={handleSearch}
            setValue={setValue}
            value={value}
          />
        </div>
      )}
    </div>
  );
}

export default Home;