// App.tsx
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LandingPage from "./pages/LandingPage.tsx";
import CourtroomPage from "./pages/CourtroomPage.tsx";
import {createNetworkConfig, SuiClientProvider} from '@mysten/dapp-kit';
import {getFullnodeUrl} from '@mysten/sui/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {WalletProvider} from '@suiet/wallet-kit';


const {networkConfig} = createNetworkConfig({
    localnet: {url: getFullnodeUrl('localnet')},
    mainnet: {url: getFullnodeUrl('mainnet')},
    testnet: {url: getFullnodeUrl('testnet')},
});

const queryClient = new QueryClient();

function App() {

    return (
        <QueryClientProvider client={queryClient}>

            <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
                <WalletProvider>
                    <BrowserRouter>

                        <Routes>
                            <Route path="/" element={<LandingPage/>}/>
                            <Route path="/courtroom" element={<CourtroomPage/>}/>
                        </Routes>
                    </BrowserRouter>
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
}

export default App;
