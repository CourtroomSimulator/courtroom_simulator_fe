import {getFullnodeUrl, SuiClient} from '@mysten/sui/client';

// 连接到 Devnet
const client = new SuiClient({url: getFullnodeUrl('testnet')});

export async function getTokenBalance(address: string, coinType: string) {
    const coins = await client.getCoins({
        owner: address,
        coinType: coinType, // 代币类型，如 SUI 是 '0x2::sui::SUI'
    });


    // 累加所有代币余额（单位为 MIST）
    const totalBalance = coins.data.reduce((sum, coin) => sum + BigInt(coin.balance), 0n);

    // 转换为 SUI（1 SUI = 1e9 MIST）
    return Number(totalBalance) / 1e8;
}