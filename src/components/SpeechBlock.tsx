// SpeechBlock.tsx
import React from "react";
import "./SpeechBlock.css";
import judgeAvatar from "../assets/judge.jpg"; // 请确保图片路径正确
import opponentAvatar from "../assets/Claiment.gif";
import mineAvatar from "../assets/Defedent.gif";

interface SpeechBlockProps {
  role: "judge" | "opponent" | "mine";
  color?: string;
  text?: string;
}

const roleMap = {
  judge: "Judge",
  opponent: "Claimant Attorney",
  mine: "me",
};

const avatarMap = {
  judge: judgeAvatar,
  opponent: opponentAvatar,
  mine: mineAvatar,
};

const SpeechBlock: React.FC<SpeechBlockProps> = ({
  role,
  color = "#FF6666", // 默认红色
  text = "",
}) => {
  return (
    <div className="speech-block-container">
      <div className="speaker-info">
        <img src={avatarMap[role]} alt={roleMap[role]} className="avatar" />
        <div className="speaker-name">{roleMap[role]}</div>
      </div>
      <div className="speech-block" style={{ backgroundColor: color }}>
        {text || roleMap[role]}
      </div>
    </div>
  );
};

export default SpeechBlock;
