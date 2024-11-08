import { Button, Link } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSearch from "../Components/AdminSearch";
import Player from "../Components/Player";

function Home({ token }) {
  const navigate = useNavigate();
  const [admin, setAdmin] = React.useState(false);
  React.useEffect(() => {
    if (token) {
      setAdmin(isAdmin());
    }
  }, [token]);

  const isAdmin = () => {
    axios
      .get("http://localhost:50000/is_admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("is admin?", response.data.is_admin);
        setAdmin(response.data.is_admin);
        return response.data.is_admin;
      });
  };

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
          textAlign: "right",
          
        }}
      >
        
        <Button variant="contained" size="small" onClick={handleLogout}>
          logout
        </Button>
      </div>
      {!admin ? (
        <div>
          <Player />
        </div>
      ) : (
        <div>
          <AdminSearch />
        </div>
      )}
    </div>
  );
}

export default Home;
