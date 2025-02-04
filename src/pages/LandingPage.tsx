// LandingPage.tsx
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ConnectButton, useWallet} from "@suiet/wallet-kit";

import '@suiet/wallet-kit/style.css';

import {mintCoin} from "../sui/mintCoin.ts";
import {getTokenBalance} from "../sui/getBalance.ts";

const csCoin = '0x8b62526154296b153d8eaff7763af537f2128ab957671c563968fd2d5b44a141::courtroom_simulator_token::COURTROOM_SIMULATOR_TOKEN';

function LandingPage() {
    const navigate = useNavigate();

    // 用于存放接口获取的按钮文字
    const [buttonText, setButtonText] = useState("加载中...");
    const [balance, setBalance] = useState<number | undefined>(undefined);


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

    // 在这里调用接口获取按钮文字
    useEffect(() => {

        setButtonText("按钮文字获取失败");
    }, []);

    // 点击按钮后，跳转到 /courtroom
    const handleClick = () => {
        navigate('/courtroom');
    };

    // const accounts = useAccounts();

    // const address = accounts[0]?.address;
    console.log("connect account: ", address);

    // mintCoin函数调用
    const handleMintClick = async () => {
        if (address) {
            try {
                const result = await mintCoin(address);
                console.log("Mint result:", result);
            } catch (error) {
                console.error("Minting failed:", error);
            }
        }
    };

    return (

        <div style={{padding: '50px'}}>
            <h2>welcome court room</h2>
            <button onClick={handleClick}>
                {buttonText}
            </button>
            <button onClick={handleMintClick}>
                Mint Coin
            </button>
            {/* 使用 suiet wallet kit 的 ConnectButton，默认点击后会弹出 modal */}
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
    );
}

export default LandingPage;
