// App.tsx
// import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import CourtroomPage from "./pages/CourtroomPage.tsx";
import { createNetworkConfig, SuiClientProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@suiet/wallet-kit";
import DevCourtroomPage from "./pages/DevCourtroomPage.tsx";
import DevLandingPage from "./pages/DevLandingPage.tsx";
import AudioController from "./components/AudioController.tsx";

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: getFullnodeUrl("testnet") },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>
          <BrowserRouter>
            <Routes>
              {/* <Route path="/" element={<LandingPage />} /> */}
              <Route path="/" element={<DevLandingPage />} />
              <Route path="/courtroom" element={<DevCourtroomPage />} />
              <Route path="/devcourtroom" element={<DevCourtroomPage />} />
            </Routes>
            <AudioController />
          </BrowserRouter>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
