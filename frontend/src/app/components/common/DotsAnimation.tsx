import React, { useState, useEffect } from "react";

const DotsAnimation = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots === "...") {
          return "";
        } else {
          return prevDots + ".";
        }
      });
    }, 500); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
};

export default DotsAnimation;