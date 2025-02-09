// src/mocks/messages.ts
import {Message} from '../types/message';

export const mockMessages: Message[] = [
    {
        "user": "judge",
        "text": "I am the judge. We are currently in the cross - examination stage. Defendant's Attorney, please refute the evidence presented by Claimant's Attorney. The court will make a final judgment based on the statements of both parties.",
        "id": 0
    },
    {
        "user": "opponent",
        "text": "Greeting, Defendant's Attorney! You need to refute the testimony and facts presented by our side and find ways to defend your client! \nI'll defeat you with my knowledge.",
        "id": 1
    }
];
