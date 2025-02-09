// SpeechBlock.tsx
import React from 'react';
import './SpeechBlock.css';

interface SpeechBlockProps {
    role: 'judge' | 'opponent' | 'mine';
    color?: string;
    text?: string;
}

const roleMap = {
    judge: 'Judge',
    opponent: 'Claimant Attorney',
    mine: 'me',
};

const SpeechBlock: React.FC<SpeechBlockProps> = ({
    role,
    color = '#FF6666',  // 默认红色
    text = '',
}) => {
    return (
        <div className="speech-block-container">
            <div className="speaker-name">{roleMap[role]}</div>
            <div className="speech-block" style={{ backgroundColor: color }}>
                {text || roleMap[role]}
            </div>
        </div>
    );
};


export default SpeechBlock;
