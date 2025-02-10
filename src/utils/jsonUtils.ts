export const extractWinnerName = (inputString: string): string | null => {
    // 正则表达式匹配包含JSON格式的字符串
    const regex = /\{\s*"winnerName":\s*"([^"]*)",\s*"text":\s*"[^"]*"\s*\}/;
    const match = inputString.match(regex);

    if (match && match[1]) {
        // 返回匹配到的 winnerName
        return match[1];
    } else {
        // 如果没有匹配到，返回 null
        return null;
    }
};

export const extractText = (inputString: string): string | null => {
    // 正则表达式匹配包含JSON格式的字符串并提取text字段
    const regex = /\{\s*"winnerName":\s*"[^"]*",\s*"text":\s*"([^"]*)"\s*\}/;
    const match = inputString.match(regex);

    if (match && match[1]) {
        // 返回匹配到的 text
        return match[1];
    } else {
        // 如果没有匹配到，返回 null
        return null;
    }
};