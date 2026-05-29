import React from "react";
import Rocket from "../../assets/user/imgs/rocket.jpg";

const Loading = () => {
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <div
        className="rocket-container"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div className="rocket-animation">
          <img
            src={Rocket}
            alt="Rocket"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "contain",
              animation: "float 2s ease-in-out infinite",
            }}
          />
        </div>
        <p
          style={{
            marginTop: "20px",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Loading...
        </p>
      </div>

      <style>{`
                /* Floating Animation */
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-30px);
                    }
                }
            `}</style>
    </div>
  );
};

export default Loading;
