import "./CourtroomPage.css";
import { useEffect, useState } from "react";
import { Evidence } from "../types/evidence";
import { Message } from "../types/message";

import { mockMessages } from "../mock/messages.ts";
import { fetchEvidences } from "../api/evidenceApi";
import { getAgentMessage } from "../api/messageApi";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import EvidenceItem from "../components/EvidenceItem";
import SpeechBlock from "../components/SpeechBlock";
import Divider from "../components/Divider";
import InputBox from "../components/InputBox";

import logoImage from "../assets/logo.png";
import courtBgImage from "../assets/Court_bg.jpg";

import { ConnectButton /*useWallet*/ } from "@suiet/wallet-kit";
import { deepseek } from "../api/deepseekApi.ts";
import { extractText, extractWinnerName } from "../utils/jsonUtils.ts";
import { useNavigate } from "react-router-dom";

export default function DevCourtroomPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [leftEvidences, setLeftEvidences] = useState<Evidence[]>([]);
  const [rightEvidences, setRightEvidences] = useState<Evidence[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showDivider, setShowDivider] = useState(false);

  // const [balance, setBalance] = useState<number | undefined>(undefined);

  const [leftExpanded, setLeftExpanded] = useState(false);
  const [rightExpanded, setRightExpanded] = useState(false);

  useEffect(() => {
    console.log("组价挂载!useEffect空依赖执行!开始获取证据及法官与双方消息!");
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
        const leftData = await fetchEvidences("left");
        console.log(leftData);
        setLeftEvidences(leftData);

        const rightData = await fetchEvidences("right");
        // console.log("fetch right evidence");
        console.log(rightData);
        setRightEvidences(rightData);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

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
        const claimantText =
          opponentList.length > 0 ? opponentList[0].text : "";

        // 构造组合 payload，格式如下：
        // [
        //   { user: "claimantAttorney", content: { text: claimantText } },
        //   { user: "defendantAttorney", content: { text: content } }
        // ]
        const combinedPayload = [
          {
            user: "claimantAttorney",
            content: { text: claimantText },
          },
          {
            user: "defendantAttorney",
            content: { text: content },
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
  const handleSummary = async () => {
    // 按 messages 数组的顺序逐条转换消息
    const summaryPayload = messages.reduce((acc, msg) => {
      if (msg.user === "opponent") {
        acc.push({
          user: "claimantAttorney",
          content: { text: msg.text },
        });
      } else if (msg.user === "mine") {
        acc.push({
          user: "defendantAttorney",
          content: { text: msg.text },
        });
      }
      return acc;
    }, [] as { user: string; content: { text: string } }[]);
    const summaryPrompt =
      'Please strictly generate the judgment content based on the above historical records, directly output a pure JSON object (without any comments, code block markers, or additional text). The format must strictly adhere to: {"winnerName": "name of the winning party", "text": "complete judgment text"}. Ensure that the \'text\' content is written in a formal and solemn tone, mimicking the style of a judge delivering a court verdict. Winner can only be chosen from claimantAttorney or defendantAttorney.';
    const combinedPayloadStr = JSON.stringify(summaryPayload) + summaryPrompt;
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
      .then(async (messageContent: string | null) => {
        if (messageContent === null || messageContent === "") {
          console.error("Received null or empty response from deepseek.");
          return; // 如果返回 null 或空字符串，提前退出
        }

        let winner = extractWinnerName(messageContent);
        let text = extractText(messageContent);
        if (text === null || text === "") {
          console.error(`Received invalid response: ${messageContent}`);
          return; // 如果返回 null 或空字符串，提前退出
        }

        // if (address) {
        console.log(winner);
        switch (winner) {
          case null:
            console.error(`Received invalid response: ${messageContent}`);
            break;
          case "claimantAttorney":
            console.log("winner: claimantAttorney");
            // await mintCoin(address, 1e8); // 等待 mintCoin 执行完成
            break;
          case "defendantAttorney":
            console.log("winner: defendantAttorney");
            // await mintCoin(address, 10 * 1e8); // 等待 mintCoin 执行完成
            break;
          // }

          // 在 mintCoin 成功后再执行 csBalance
          // await csBalance(); // 确保 mintCoin 成功后再调用 csBalance
        }

        const newMessage: Message = {
          id: Date.now(), // 使用 Date.now() 来生成唯一 ID，或者你可以使用其他方式
          user: "judge", // 假设这里是 judge 角色，你可以根据需求动态设置
          text: text,
        };

        setMessages((prev) => [...prev, newMessage]);
        // 显示弹窗
        if (winner === "claimantAttorney") {
          window.alert("You lose");
        } else if (winner === "defendantAttorney") {
          window.alert("You win");
        }
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
      user: "divider",
      text: "Pronounce",
    };
    // 在合适的位置插入 divider，例如追加到末尾
    setMessages((prev) => [...prev, dividerMsg]);
    setShowSummary(true);
  };
  // 点击后显示分割线，并让按钮失效
  const handleEndProof = () => {
    const dividerMsg: Message = {
      id: Date.now(),
      user: "divider",
      text: "The cross - examination is concluded",
    };
    // 在合适的位置插入 divider，例如追加到末尾
    setMessages((prev) => [...prev, dividerMsg]);
    setShowDivider(true); // 或根据你的需求，不再需要 showDivider 状态控制按钮
  };
  return (
    <div className="app-container">
      <div className="header">
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "default" }}
        >
          <img src={logoImage} alt="" />
          <p>Courtroom Simulator</p>
        </div>
        {/* ConnectButton 固定在右上角 */}
        <div className="connect-button">
          <ConnectButton
            onConnectError={(error) => {
              console.error("Connect error: ", error);
            }}
          />
          {/* {balance !== null && (
            <div style={{ marginTop: "20px" }}>
              <h3>CS Balance: {balance?.toFixed(9)}</h3>
            </div>
          )} */}
        </div>
      </div>
      <div className="main" style={{ backgroundImage: `url(${courtBgImage})` }}>
        {/* 左侧证据区 */}
        <div className="left-panel">
          {leftExpanded ? (
            <>
              <button
                className="toggle-button toggle-up"
                onClick={() => setLeftExpanded(false)}
              >
                <FaChevronUp />
              </button>
              {leftEvidences.map((ev) => (
                <EvidenceItem
                  key={ev.id}
                  text={ev.title}
                  backgroundColor="rgba(230, 162, 60, 0.85)"
                />
              ))}
            </>
          ) : (
            <>
              {leftEvidences.slice(0, 1).map((ev) => (
                <EvidenceItem
                  key={ev.id}
                  text={ev.title}
                  backgroundColor="rgba(230, 162, 60, 0.85)"
                />
              ))}
              {leftEvidences.length > 1 && (
                <button
                  className="toggle-button toggle-down"
                  onClick={() => setLeftExpanded(true)}
                >
                  <FaChevronDown />
                </button>
              )}
            </>
          )}
        </div>

        {/* 中间区域：消息展示区 + 固定底部的输入区和按钮 */}
        <div className="middle-panel">
          {/* 消息展示区 */}
          <div className="messages-container">
            {messages.map((msg) => {
              if (msg.user === "divider") {
                return <Divider key={msg.id} text={msg.text} />;
              }
              return (
                <SpeechBlock
                  key={msg.id}
                  role={msg.user as "judge" | "opponent" | "mine"}
                  color={
                    msg.user === "judge"
                      ? "rgba(165, 42, 42, 0.85)"
                      : msg.user === "opponent"
                      ? "rgba(230, 162, 60, 0.85)"
                      : "rgba(255, 248, 220, 0.9)"
                  }
                  text={msg.text}
                />
              );
            })}
          </div>
          {/* 固定底部：输入框和按钮 */}
          <div className="chat-footer">
            <InputBox onSend={handleMyMessageSend} />
            <div className="buttons">
              <button onClick={handleEndProof} disabled={showDivider}>
                Conclude the Cross - Examination
              </button>
              <button onClick={handleSummary} disabled={showSummary}>
                Pronounce
              </button>
            </div>
          </div>
        </div>

        {/* 右侧证据区 */}
        <div className="right-panel">
          {rightExpanded ? (
            <>
              <button
                className="toggle-button toggle-up"
                onClick={() => setRightExpanded(false)}
              >
                <FaChevronUp />
              </button>
              {rightEvidences.map((ev) => (
                <EvidenceItem
                  key={ev.id}
                  text={ev.title}
                  backgroundColor="rgba(165, 42, 42, 0.85)"
                />
              ))}
            </>
          ) : (
            <>
              {rightEvidences.slice(0, 1).map((ev) => (
                <EvidenceItem
                  key={ev.id}
                  text={ev.title}
                  backgroundColor="rgba(165, 42, 42, 0.85)"
                />
              ))}
              {rightEvidences.length > 1 && (
                <button
                  className="toggle-button toggle-down"
                  onClick={() => setRightExpanded(true)}
                >
                  <FaChevronDown />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
