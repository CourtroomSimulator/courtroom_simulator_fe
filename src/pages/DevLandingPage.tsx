import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import "./LandingPage.css";

import logoImage from "../assets/logo.png";
import courtBgImage from "../assets/Court_bg.jpg";
import AudioController from "../components/AudioController";

export default function DevLandingPage() {
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState("Loading...");

  useEffect(() => {
    setButtonText(
      "The Case of Amelia Brown versus John Dow on the Charge of Bigamy"
    );
  }, []);

  const handleClick = () => {
    navigate("/courtroom");
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="logo">
          <img src={logoImage} alt="" />
          <p>Courtroom Simulator</p>
        </div>
        <div className="connect-button">
          <ConnectButton
            onConnectError={(error) => {
              console.error("Connect error: ", error);
            }}
          />
        </div>
      </div>

      <div className="main" style={{ backgroundImage: `url(${courtBgImage})` }}>
        <div className="landing-content">
          <h1>Welcome to the Court Room Simulator</h1>
          <h2>Enter a case to simulate...</h2>
          <button className="case-button" onClick={handleClick}>
            {buttonText}
          </button>
        </div>
      </div>
      {/* <AudioController /> */}
    </div>
  );
}
