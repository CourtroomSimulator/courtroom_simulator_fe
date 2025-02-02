// src/api/messageApi.ts
import {Message} from '../types/message';
import {mockMessages} from "../mock/messages.ts";

const useMock = import.meta.env.VITE_USE_MOCK;

export async function fetchMessages(content?: string): Promise<Message[]> {
    console.log("mock messages =", useMock);
    // 通过环境变量切换 Mock 数据
    if (useMock === 'true') {
        console.log("mock messages...",);
        return mockMessages; // 直接返回 Mock 数据
    }

    // 真实请求逻辑
    const res =
        await fetch('/api/messages', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content}),
        });
    if (!res.ok) {
        throw new Error('Failed to fetch messages');
    }
    const data: Message[] = await res.json();
    return data;
}