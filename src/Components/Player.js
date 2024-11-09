import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { io } from "socket.io-client";
import config from "../Config";

function Player({ token }) {
    const socket = io(config.apiUrl , {
        transports: ['websocket', 'polling'], // Specify transports for compatibility
      });;
  const [scrolling, setScrolling] = React.useState(false);
  const scrollAnimationFrame = React.useRef(null);
  const [dots, setDots] = React.useState("");
  const [presentSong, setPresentSong] = React.useState(null);
  const [isSingerValue,setIsSingerValue] = React.useState(false);;
  const socketRef = React.useRef();
  const containsHebrew = (text) => {
      return /[\u0590-\u05FF]/.test(text);
    };
    const isTitleHebrew = presentSong?.title && containsHebrew(presentSong.title);
    
    
    // check if user is singer
    React.useEffect(() => {
        
            axios
            .get(`${config.apiUrl}/is_singer`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log("is singer?:", response);
                setIsSingerValue(response.data);
            });
        
        
    }, [token]);
  const smoothScrollToEnd = () => {
    // Scroll a few pixels down
    window.scrollBy({ top: 5, behavior: "smooth" });

    // Continue scrolling if not at the bottom of the page
    if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
      scrollAnimationFrame.current = requestAnimationFrame(smoothScrollToEnd);
    } else {
      // Stop scrolling automatically if the end is reached
      setScrolling(false);
      cancelAnimationFrame(scrollAnimationFrame.current);
    }
  };

  const handleScroll = () => {
    if (scrolling) {
      // Stop scrolling
      cancelAnimationFrame(scrollAnimationFrame.current);
      setScrolling(false);
    } else {
      // Start scrolling
      setScrolling(true);
      smoothScrollToEnd();
    }
  };
//   get data from server socket
  React.useEffect(() => {
    socket.on("server_response", (data) => {
      setPresentSong(data);
    });
    return () => {
      socket.off("server_response");
    };
  }, [socket]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length > 2) {
          return "";
        }
        return prevDots + ".";
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>
        {presentSong !== null && presentSong !== "" && presentSong !== undefined ?<Button
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
        </Button>:<></> 
             }
        
      </div>
      {presentSong !== null &&
      presentSong !== "" &&
      presentSong !== undefined ? (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "Menu",
              direction: isTitleHebrew ? "rtl" : "ltr",
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
                    whiteSpace: "nowrap", // Ensure words stay together
                    maxWidth: "90%", // Prevent overflow by controlling max width
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{line.lyrics}</div>
                  {!isSingerValue && line.chords ? ( // Only show chords if not a singer
                    <div style={{ fontSize: "6vw", color: "red" }}>
                      ({line.chords})
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <h1>Waitng for the next song{dots}</h1>
      )}
    </div>
  );
}

export default Player;
