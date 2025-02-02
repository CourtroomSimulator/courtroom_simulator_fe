// SpeechBlock.tsx
import React from 'react';
import './SpeechBlock.css';

interface SpeechBlockProps {
    role: 'judge' | 'opponent' | 'mine';
    color?: string;
    text?: string;
}

const roleMap = {
    judge: '法官',
    opponent: '对方',
    mine: '我方',
};

const SpeechBlock: React.FC<SpeechBlockProps> = ({
                                                     role,
                                                     color = '#FF6666',  // 默认红色
                                                     text = '',
                                                 }) => {
    return (
        <div className="speech-block" style={{ backgroundColor: color }}>
            {text || roleMap[role]}
        </div>
    );
};

export default SpeechBlock;
