import { Button, Link } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Admin from "../Components/Admin";
import Player from "../Components/Player";

function Home({ token }) {
  const navigate = useNavigate();
  const [admin,setAdmin]=React.useState(false);
  React.useEffect(() => {
    if (token) {
    setAdmin(isAdmin())
    }
  }, [token]);

  const isAdmin = () => {
    axios.get("http://localhost:50000/is_admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      console.log("is admin?", response.data.is_admin);
      setAdmin(response.data.is_admin);
      return response.data.is_admin;
    })
    }

  const handleLogout = () => {
    localStorage.setItem("is_logged_in", false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
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
        <h2 style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          Home
        </h2>
        <Button variant="contained" size="small" onClick={handleLogout}>
          logout
        </Button>

    
      </div>
      {!admin? 
      <div>
        
            <Player/>
      </div>
      
      :
      <div>
        <h1><Admin/></h1>
      </div>
      }
    </div>
  );
}

export default Home;
