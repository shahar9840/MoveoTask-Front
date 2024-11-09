import { Button } from "@mui/material";
import React from "react";

import config from "../Config";



function Result({ token, chosenSong, admin }) {
  const [scrolling, setScrolling] = React.useState(false);
  const scrollAnimationFrame = React.useRef(null);

  React.useEffect(() => {
    console.log("chosen song", chosenSong);
  }, [chosenSong]);

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
  
  const containsHebrew = (text) => {
    return /[\u0590-\u05FF]/.test(text);
  };

  const isTitleHebrew = chosenSong?.title && containsHebrew(chosenSong.title);

  return (
    <div style={{ padding: "10px", maxWidth: "100%", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>

        <div>
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
        </div>
      </div>

      {admin ? (
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
              {chosenSong.title} - {chosenSong.artist}
            </h2>
          </div>
          <div>
            {chosenSong.lyrics.map((verse, index) => (
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
                    {line.chords ? (
                      <div style={{ fontSize: "6vw", color: "red" }}>
                        ({line.chords})
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>no</div>
      )}
    </div>
  );
}

export default Result;
