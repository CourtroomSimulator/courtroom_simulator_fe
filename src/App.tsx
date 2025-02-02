// App.tsx
import React, {useState, useEffect} from 'react';
import './App.css';

// 1. 引入我们写的类型
import {Message} from './types/message';
import {Evidence} from './types/evidence';

// 2. 引入API函数
import {fetchMessages} from './api/messageApi';
import {fetchEvidences} from './api/evidenceApi';

import EvidenceItem from './components/EvidenceItem';
import SpeechBlock from './components/SpeechBlock';
import Divider from './components/Divider';
import InputBox from './components/InputBox';

function App() {
    // 原先的 messages state 用于存储所有发言
    const [messages, setMessages] = useState<Message[]>([]);

    // 新增：左右证据列表
    const [leftEvidences, setLeftEvidences] = useState<Evidence[]>([]);
    const [rightEvidences, setRightEvidences] = useState<Evidence[]>([]);

    // 在组件挂载时，通过useEffect获取数据
    useEffect(() => {
        console.log("useEffect 执行了");
        (async () => {
            try {
                console.log("Loading...");
                // 1. 获取法官和对方的消息
                const fetchedMsgs = await fetchMessages();
                console.log(fetchedMsgs);
                // 2. 假设我们想把这些消息放到 messages 中
                //    如果你想保留“我方”初始化消息，也可以先写死一条我方发言再 concat
                setMessages(fetchedMsgs);

                // 3. 获取左右证据
                const leftData = await fetchEvidences('left');
                console.log(leftData);
                setLeftEvidences(leftData);

                const rightData = await fetchEvidences('right');
                // console.log("fetch right evidence");
                console.log(rightData);
                setRightEvidences(rightData);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);
    // 空依赖数组[]表示仅在组件初次挂载时调用一次

    // 当 InputBox 触发发送时，会调用这个函数
    // content 即输入框中的文本
    // 输入框发送“我方”消息
    const handleMyMessageSend = (content: string) => {
        console.log("send message", content);
        const newMsg: Message = {
            id: Date.now(),
            role: 'mine',
            text: content,
        };
        setMessages((prev) => [...prev, newMsg]);

        fetchMessages(content)
            .then((newList) => {
                setMessages(prev => [...prev, ...newList]);
            })
            .catch((err) => console.error(err));

    };

    return (
        <div className="app-container">
            {/* 左侧证据区 */}
            <div className="left-panel">
                {leftEvidences.map((ev) => (
                    <EvidenceItem key={ev.id} text={ev.title}/>
                ))}
            </div>

            {/* 中间发言区 */}
            <div className="middle-panel">
                {/**
                 * 在这里根据 messages 数组渲染一系列 SpeechBlock，
                 * 比如：当我们遍历到第三条时插入一个 Divider，
                 * 这里只是演示做法，实际项目可以根据后端逻辑判断插入位置
                 */}
                {messages.map((msg, index) => (
                    <React.Fragment key={msg.id}>
                        <SpeechBlock
                            role={msg.role}
                            // 根据role传不同颜色
                            color={
                                msg.role === 'judge'
                                    ? '#FF6666'
                                    : msg.role === 'opponent'
                                        ? '#66B0FF'
                                        : '#FFFF88'
                            }
                            text={msg.text}
                        />
                        {/** 当index为2的时候插入一个 Divider(仅演示) */}
                        {index === 2 && <Divider text="质证结束"/>}
                    </React.Fragment>
                ))}

                {/* 输入框，用来发送'我方'消息 */}
                <InputBox onSend={handleMyMessageSend}/>
            </div>

            {/* 右侧证据区 */}
            <div className="right-panel">
                {rightEvidences.map((ev) => (
                    <EvidenceItem key={ev.id} text={ev.title}/>
                ))}
            </div>
        </div>
    );
}

export default App;
