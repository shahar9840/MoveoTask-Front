import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSearch from "../Components/AdminSearch";
import Player from "../Components/Player";
import Result from "../Components/Result";
import { io } from "socket.io-client";
import config from "../Config";

function Home({ token, setToken }) {
  const navigate = useNavigate();
  const [socket, setSocket] = React.useState(null);
  const [value, setValue] = React.useState(null);
  const [chosenSong, setChosenSong] = React.useState(null);
  const [admin, setAdmin] = React.useState(false);

  // Initialize socket connection once
  React.useEffect(() => {
    const socketInstance = io(`${config.apiUrl}`, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      autoConnect: true,
    });

    setSocket(socketInstance);

    // Cleanup socket connection on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Emit event when chosenSong changes
  React.useEffect(() => {
    if (socket && chosenSong) {
      socket.emit("user_connected", chosenSong);
    }
  }, [chosenSong, socket]);

  // Check if user is admin
  React.useEffect(() => {
    if (token) {
      checkIfAdmin();
    }
  }, [token]);

  const checkIfAdmin = () => {
    axios
      .get(`${config.apiUrl}/is_admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAdmin(response.data.is_admin);
      })
      .catch((error) => {
        console.error("Error checking admin status:", error);
      });
  };
  // Handle logout
  const handleLogout = () => {
    localStorage.setItem("is_logged_in", false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };
// Handle search
  const handleSearch = () => {
    setChosenSong(value);
  };

  
// Handle back
  const handleBack = () => {
    setChosenSong(null);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row-reverse",
          textAlign: "right",
          padding: "10px",
          '@media (maxWidth: 600px)': {
            textAlign: "center",
            padding: "5px",
          },
        }}
      >
        <Button variant="contained" size="small" onClick={handleLogout}>
          Logout
        </Button>
        {chosenSong && (
          <Button variant="contained" size="small" onClick={handleBack}>
            Quit
          </Button>
        )}
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