// src/api/messageApi.ts
import {mockMessages} from "../mock/messages.ts";
import axios from "axios";

const useMock = import.meta.env.VITE_USE_MOCK;
const agentURL = import.meta.env.VITE_AGENT_URL;
//
// export async function fetchMessages(content?: string): Promise<Message[]> {
//     console.log("mock messages =", useMock);
//     // 通过环境变量切换 Mock 数据
//     if (useMock === 'true') {
//         console.log("mock messages...",);
//         return mockMessages; // 直接返回 Mock 数据
//     }
//
//     // 真实请求逻辑
//     const res =
//         await fetch('/api/messages', {
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({content}),
//         });
//     if (!res.ok) {
//         throw new Error('Failed to fetch messages');
//     }
//     const data: Message[] = await res.json();
//     return data;
// }
//


// 获取所有 agents
export const fetchAgents = async () => {
    try {
        const response = await axios.get(`${agentURL}/agents`, {
            headers: {
                Accept: "application/json",
            },
            // 去掉 withCredentials，表示不带凭证
        });

        return response.data.agents;
    } catch (error) {
        console.error("Failed to fetch agents:", error);
        throw error;
    }
};

// 根据 agent ID 获取消息
export const fetchMessages = async (agentId: string, text: string, user: string) => {
    if (useMock === 'true') {
        console.log("mock messages...",);
        return mockMessages; // 直接返回 Mock 数据
    }

    try {
        const url = `${agentURL}/${agentId}/message`;

        // 创建 FormData
        const formData = new FormData();
        formData.append("text", text);
        formData.append("user", user);

        // 发送请求
        const response = await axios.post(url, formData, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data",
            },
            // 去掉 withCredentials，表示不带凭证
        });

        return response.data;
    } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
    }
};

// 根据 agent name 获取对应的 ID，然后获取消息
export const getAgentMessage = async (agentName: string, text: string) => {
    try {
        const agents = await fetchAgents();
        const agent = agents.find((a: any) => a.name === agentName);

        if (!agent) {
            throw new Error(`Agent with name "${agentName}" not found`);
        }

        const messages = await fetchMessages(agent.id, text, 'user');
        return messages.map((msg: any, index: number) => ({
            id: Date.now() + index, // 生成唯一 ID
            user: msg.user, // 角色转换
            text: msg.text
        }));
    } catch (error) {
        console.error("Error getting agent message:", error);
        throw error;
    }
};
