// Please install OpenAI SDK first: `npm install openai`

import OpenAI from "openai";

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: DEEPSEEK_API_KEY,
    dangerouslyAllowBrowser: true
});

 export async function deepseek(content:string) {
    const completion = await openai.chat.completions.create({
        messages: [{role: "system", content: content}],
        model: "deepseek-chat",
    });

    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
}

