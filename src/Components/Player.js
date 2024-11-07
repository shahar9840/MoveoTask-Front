import React from 'react'

function Player() {
    const[dots,setDots]=React.useState('');
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
    <h1>Waitng for the next song{dots}</h1>
  )
}

export default Player