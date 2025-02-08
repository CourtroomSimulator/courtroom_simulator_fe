// App.tsx
import {useState, useEffect, useRef} from 'react';
import {useNavigate} from "react-router-dom";

import './CourtroomPage.css';

// 1. 引入我们写的类型
import {Message} from '../types/message';
import {Evidence} from '../types/evidence';

// 2. 引入API函数
import {getAgentMessage} from '../api/messageApi';
import {fetchEvidences} from '../api/evidenceApi';

import EvidenceItem from '../components/EvidenceItem';
import SpeechBlock from '../components/SpeechBlock';
import Divider from '../components/Divider';
import InputBox from '../components/InputBox';
// import { useCurrentAccount} from '@mysten/dapp-kit';
import {ConnectButton, useWallet} from "@suiet/wallet-kit";
import {getTokenBalance} from "../sui/getBalance.ts";
import {mockMessages} from "../mock/messages.ts";
import {deepseek} from "../api/deepseekApi.ts";


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
                const fetchedMsgs = mockMessages;
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

        // 1. 添加用户输入的消息到消息列表中
        const userMsg: Message = {
            id: Date.now(),
            user: "mine",
            text: content,
        };
        setMessages((prev) => [...prev, userMsg]);

        // 2. 调用 claimantAttorney 接口
        getAgentMessage("claimantAttorney", content)
            .then((claimantList: Message[]) => {
                // 将 claimantAttorney 返回的每条消息的 user 字段改为 "opponent"
                const opponentList: Message[] = claimantList.map((msg: Message) => ({
                    ...msg,
                    user: "opponent" as "opponent",
                }));

                // 使用 console.log 输出每条消息
                opponentList.forEach((msg: Message) =>
                    console.log(`Message from ${msg.user}: ${msg.text}`)
                );

                // 将处理后的消息添加到消息列表中
                setMessages((prev) => [...prev, ...opponentList]);

                // 从 claimantAttorney 的响应中取第一条消息的文本作为回复文本（如果有）
                const claimantText = opponentList.length > 0 ? opponentList[0].text : "";

                // 构造组合 payload，格式如下：
                // [
                //   { user: "claimantAttorney", content: { text: claimantText } },
                //   { user: "defendantAttorney", content: { text: content } }
                // ]
                const combinedPayload = [
                    {
                        user: "claimantAttorney",
                        content: {text: claimantText},
                    },
                    {
                        user: "defendantAttorney",
                        content: {text: content},
                    },
                ];
                console.log("combinedPayload:", combinedPayload);

                // 将组合 payload 转为 JSON 字符串
                const combinedPayloadStr = JSON.stringify(combinedPayload);

                // 3. 调用 judge 接口，处理方式与 claimantAttorney 一致
                return getAgentMessage("judge", combinedPayloadStr);
            })
            .then((judgeList: Message[]) => {
                // 使用 console.log 输出 judge 接口返回的每条消息
                judgeList.forEach((msg: Message) =>
                    console.log(`Message from ${msg.user}: ${msg.text}`)
                );
                // 将 judge 返回的消息添加到消息列表中
                setMessages((prev) => [...prev, ...judgeList]);
            })
            .catch((err) => console.log(err));
    };

    // 控制“质证结束”分割线是否显示
    const [showSummary, setShowSummary] = useState(false);
    // 新增：总结按钮点击时处理函数（使用 reduce 按顺序拼接）
    const handleSummary = async () => {
        // 按 messages 数组的顺序逐条转换消息
        const summaryPayload = messages.reduce((acc, msg) => {
            if (msg.user === "opponent") {
                acc.push({
                    user: "claimantAttorney",
                    content: {text: msg.text},
                });
            } else if (msg.user === "mine") {
                acc.push({
                    user: "defendantAttorney",
                    content: {text: msg.text},
                });
            }
            return acc;
        }, [] as { user: string; content: { text: string } }[]);

        const combinedPayloadStr = JSON.stringify(summaryPayload);
        console.log("Summary payload:", combinedPayloadStr);

        // 调用 judge 接口
        // getAgentMessage("judge", combinedPayloadStr)
        //     .then((judgeList: Message[]) => {
        //         judgeList.forEach((msg: Message) =>
        //             console.log(`Summary message from ${msg.user}: ${msg.text}`)
        //         );
        //         // 可选：将返回的消息添加到消息列表中
        //         setMessages((prev) => [...prev, ...judgeList]);
        //     })
        //     .catch((error) => console.error("Summary error:", error));

        // const messageContent = await deepseek(combinedPayloadStr);
        deepseek(combinedPayloadStr)
            .then((messageContent: string | null) => {
                if (messageContent === null || messageContent === '') {
                    console.error("Received null or empty response from deepseek.");
                    return; // 如果返回 null 或空字符串，提前退出
                }

                const newMessage: Message = {
                    id: Date.now(), // 使用 Date.now() 来生成唯一 ID，或者你可以使用其他方式
                    user: 'judge', // 假设这里是 judge 角色，你可以根据需求动态设置
                    text: messageContent,
                };

                setMessages((prev) => [...prev, newMessage]);

                // const dividerMsg: Message = {
                //     id: Date.now(),
                //     user: 'divider',
                //     text: '总结',
                // };
                // // 在合适的位置插入 divider，例如追加到末尾
                // setMessages((prev) => [...prev, dividerMsg]);
                //
                // setShowSummary(true);
            })
            .catch((error) => {
                console.error("Error from deepseek:", error);
            });


        // if (!messageContent) {
        //     console.error("从 deepseek 获取到 null 或空的响应。");
        //     return; // 如果返回 null 或空字符串，提前退出
        // }
        //
        // const newMessage: Message = {
        //     id: Date.now(), // You can use Date.now() to generate a unique ID, or use another strategy.
        //     user: 'judge', // Assuming the role here, but you can dynamically set this based on your requirements
        //     text: messageContent,
        // };
        //
        // setMessages((prev) => [...prev, newMessage]);

        const dividerMsg: Message = {
            id: Date.now() - 1,
            user: 'divider',
            text: '总结',
        };
        // 在合适的位置插入 divider，例如追加到末尾
        setMessages(prev => [...prev, dividerMsg]);
        setShowSummary(true);
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

    // 控制“质证结束”分割线是否显示
    const [showDivider, setShowDivider] = useState(false);

    // 点击后显示分割线，并让按钮失效
    const handleEndProof = () => {
        const dividerMsg: Message = {
            id: Date.now(),
            user: 'divider',
            text: '质证结束',
        };
        // 在合适的位置插入 divider，例如追加到末尾
        setMessages(prev => [...prev, dividerMsg]);
        setShowDivider(true); // 或根据你的需求，不再需要 showDivider 状态控制按钮
    };


    return (
        <div className="app-container">
            {/* 左侧证据区 */}
            <div className="left-panel">
                {leftEvidences.map((ev) => (
                    <EvidenceItem key={ev.id} text={ev.title} backgroundColor="#6666ff"/>
                ))}
            </div>

            {/* 中间区域：消息展示区 + 固定底部的输入区和按钮 */}
            <div className="middle-panel">
                {/* 消息展示区 */}
                <div className="messages-container">
                    {messages.map((msg) => {
                        if (msg.user === 'divider') {
                            return <Divider key={msg.id} text={msg.text}/>;
                        }
                        return (
                            <SpeechBlock
                                key={msg.id}
                                role={msg.user as 'judge' | 'opponent' | 'mine'}
                                color={
                                    msg.user === 'judge'
                                        ? '#FF6666'
                                        : msg.user === 'opponent'
                                            ? '#66B0FF'
                                            : '#FFFF88'
                                }
                                text={msg.text}
                            />
                        );
                    })}
                </div>
                {/* 固定底部：输入框和按钮 */}
                <div className="chat-footer">
                    <InputBox onSend={handleMyMessageSend}/>
                    <div className="buttons">
                        <button
                            onClick={handleEndProof}
                            disabled={showDivider}
                        >
                            质证结束
                        </button>
                        <button
                            onClick={handleSummary}
                            disabled={showSummary}
                        >
                            总结
                        </button>
                    </div>
                </div>
            </div>

            {/* 右侧证据区 */}
            <div className="right-panel">
                {rightEvidences.map((ev) => (
                    <EvidenceItem key={ev.id} text={ev.title} backgroundColor="#ff9966"/>
                ))}
            </div>

            {/* ConnectButton 固定在右上角 */}
            <div className="connect-button">
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
    );


}

export default CourtroomPage;
