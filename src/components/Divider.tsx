// Divider.tsx
import React from 'react';
import './Divider.css';

interface DividerProps {
    text?: string; // 分割线中间显示的文字
}

const Divider: React.FC<DividerProps> = ({ text }) => {
    return (
        <div className="divider">
            <span>{text}</span>
        </div>
    );
};

export default Divider;
