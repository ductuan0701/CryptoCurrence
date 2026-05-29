import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      onClick={handleClick}
      style={{
        display: isVisible ? "block" : "none",
        position: "fixed",
        bottom: "95px",
        right: "35px",
        backgroundColor: "#FF2E2E",
        border: "none",
        borderRadius: "50%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        padding: "10px",
        cursor: "pointer",
        zIndex: 999,
      }}
    >
      <FontAwesomeIcon icon={faChevronUp} style={{ fontSize: "24px", color: "white" }} />
    </button>
  );
};

export default BackToTop;
