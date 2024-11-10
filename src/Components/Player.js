import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { io } from "socket.io-client";
import config from "../Config";

function Player({ token }) {
  const [scrolling, setScrolling] = React.useState(false);
  const scrollAnimationFrame = React.useRef(null);
  const [dots, setDots] = React.useState("");
  const [presentSong, setPresentSong] = React.useState(null);
  const [isSingerValue, setIsSingerValue] = React.useState(false);
  const [socket, setSocket] = React.useState(null);

  // Initialize socket connection once
  React.useEffect(() => {
    const socketInstance = io(`${config.apiUrl}`, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      autoConnect: true,
    });

    setSocket(socketInstance); // Save the socket instance in state

    // Clean up the socket connection on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Listen for server responses
  React.useEffect(() => {
    if (socket) {
      socket.on("server_response", (data) => {
        setPresentSong(data);
      });

      // Clean up the event listener when component unmounts or dependencies change
      return () => {
        socket.off("server_response");
      };
    }
  }, [socket]);

  // Check if the user is a singer
  React.useEffect(() => {
    if (token) {
      axios
        .get(`${config.apiUrl}/is_singer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsSingerValue(response.data);
        })
        .catch((error) => {
          console.error("Error fetching singer status:", error);
        });
    }
  }, [token]);

  // Smooth scrolling logic
  const smoothScrollToEnd = () => {
    window.scrollBy({ top: 5, behavior: "smooth" });
    if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
      scrollAnimationFrame.current = requestAnimationFrame(smoothScrollToEnd);
    } else {
      setScrolling(false);
      cancelAnimationFrame(scrollAnimationFrame.current);
    }
  };

  const handleScroll = () => {
    if (scrolling) {
      cancelAnimationFrame(scrollAnimationFrame.current);
      setScrolling(false);
    } else {
      setScrolling(true);
      smoothScrollToEnd();
    }
  };

  // Dots animation for waiting state
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length > 2 ? "" : prevDots + "."));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>
        
        {presentSong && (
          <Button
            onClick={handleScroll}
            sx={{
              position: "fixed",
              bottom: { xs: "5px", md: "10px" },
              right: { xs: "5px", md: "10px" },
              padding: { xs: "8px 16px", md: "10px 20px" },
              fontSize: { xs: "14px", md: "16px" },
              zIndex: 1000,
            }}
          >
            {scrolling ? "Stop Scrolling" : "Scroll to End"}
          </Button>
        )}
      </div>
      
      {presentSong ? (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "Menu",
              direction: presentSong.title && /[\u0590-\u05FF]/.test(presentSong.title) ? "rtl" : "ltr",
              wordWrap: "break-word",
            }}
          >
            <h2 style={{ fontSize: "6vw", textAlign: "center" }}>
              {presentSong.title} - {presentSong.artist}
            </h2>
          </div>

          {presentSong.lyrics.map((verse, index) => (
            <div
              key={index}
              style={{
                marginBottom: "1em",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {verse.map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  style={{
                    margin: "5px",
                    padding: "5px",
                    textAlign: "center",
                    fontSize: "6vw",
                    whiteSpace: "nowrap",
                    maxWidth: "90%",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{line.lyrics}</div>
                  {!isSingerValue && line.chords && (
                    <div style={{ fontSize: "6vw", color: "red" }}>
                      ({line.chords})
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <h1>Waiting for the next song{dots}</h1>
      )}
    </div>
  );
}

export default Player;