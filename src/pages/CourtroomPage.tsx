// App.tsx
import React, {useState, useEffect,useRef} from 'react';
import { useNavigate } from "react-router-dom";

import './CourtroomPage.css';

// 1. 引入我们写的类型
import {Message} from '../types/message';
import {Evidence} from '../types/evidence';

// 2. 引入API函数
import {fetchMessages} from '../api/messageApi';
import {fetchEvidences} from '../api/evidenceApi';

import EvidenceItem from '../components/EvidenceItem';
import SpeechBlock from '../components/SpeechBlock';
import Divider from '../components/Divider';
import InputBox from '../components/InputBox';
// import { useCurrentAccount} from '@mysten/dapp-kit';
import {ConnectButton, useWallet} from "@suiet/wallet-kit";
import {getTokenBalance} from "../sui/getBalance.ts";


const csCoin = '0x8b62526154296b153d8eaff7763af537f2128ab957671c563968fd2d5b44a141::courtroom_simulator_token::COURTROOM_SIMULATOR_TOKEN';

function CourtroomPage() {
    const navigate = useNavigate();

    // 原先的 messages state 用于存储所有发言
    const [messages, setMessages] = useState<Message[]>([]);

    // 新增：左右证据列表
    const [leftEvidences, setLeftEvidences] = useState<Evidence[]>([]);
    const [rightEvidences, setRightEvidences] = useState<Evidence[]>([]);

    const [balance, setBalance] = useState<number | undefined>(undefined);

    // const currentAccount = useCurrentAccount();
    // const [open, setOpen] = useState(false);
    // 使用 suiet wallet kit 的 useWallet hook
    const wallet = useWallet();
    const address = wallet.account?.address;
    const csBalance = async () => {
        if (address) {
            try {
                const coinBalance = await getTokenBalance(address, csCoin);
                console.log("CS balance:", balance);
                setBalance(coinBalance);
            } catch (err) {
                console.error(err);
            }
        }
    }
    useEffect(() => {
        if (address) {
            csBalance();
        }
    }, [address]);

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

    // 用于检测上一次的账户状态
    const prevAccountRef = useRef(wallet.account);

    // 当钱包断开连接时跳转到指定页面
    useEffect(() => {
        if (!wallet.connected) {
            // 当断开连接时，跳转到例如 /disconnected 页面
            navigate("/");
        }
    }, [wallet.connected, navigate]);

    // 当钱包账户发生变化时跳转
    useEffect(() => {
        if (
            prevAccountRef.current && // 如果之前存在账户
            wallet.account && // 当前有账户
            wallet.account.address !== prevAccountRef.current.address
        ) {
            // 账户发生切换，跳转到其他页面
            navigate("/");
        }
        // 更新上一次账户
        prevAccountRef.current = wallet.account;
    }, [wallet.account, navigate]);

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
            {/* ConnectButton 固定在右上角 */}
            <div className="connect-button">
                <div className='connect-button'>
                    <ConnectButton
                        onConnectError={(error) => {
                            console.error("Connect error: ", error);
                        }}
                    />
                    {balance !== null && (
                        <div style={{marginTop: "20px"}}>
                            <h3>CS Balance: {balance?.toFixed(9)}</h3>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default CourtroomPage;
