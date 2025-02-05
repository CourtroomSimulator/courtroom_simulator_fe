// message.d.ts

export interface Message {
    id: number;                // 消息的唯一ID
    user: 'judge' | 'opponent' | 'mine';  // 角色：法官、对方、我方
    text: string;              // 发言内容
}
