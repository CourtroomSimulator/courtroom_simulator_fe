// InputBox.tsx
import React, { useState } from 'react';
import './InputBox.css';

interface InputBoxProps {
    onSend?: (content: string) => void;
    // 允许在父组件中传入一个回调函数，用于处理发送的消息
}

const InputBox: React.FC<InputBoxProps> = ({ onSend }) => {
    const [value, setValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSend = () => {
        if (value.trim() && onSend) {
            onSend(value);
            setValue('');
        }
    };

    // 按下回车也触发发送
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="input-box">
            <input
                type="text"
                placeholder="请输入..."
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default InputBox;
