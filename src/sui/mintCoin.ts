import {Transaction} from '@mysten/sui/transactions';
import {SuiClient, getFullnodeUrl, SuiTransactionBlockResponse} from "@mysten/sui/client";
import {Ed25519Keypair} from "@mysten/sui/keypairs/ed25519";

const suiClient = new SuiClient({url: getFullnodeUrl("testnet")});
const secretKey = import.meta.env.VITE_SUI_PRIVATE_KEY;
const keypair = Ed25519Keypair.fromSecretKey(secretKey);

export async function mintCoin(address: string): Promise<SuiTransactionBlockResponse> {
    console.log(`mintCoin address: ${address}`);
    const tx = new Transaction();
    const packageId = "0x8b62526154296b153d8eaff7763af537f2128ab957671c563968fd2d5b44a141";
    console.log("signer: ", keypair.toSuiAddress())
    const treasuryCapId = '0x1d5d60ba8024edfd3340572fa9907b4a7f333aeb0bb02c8a00647d81b35ff9c4';
    const moduleName = "courtroom_simulator_token";
    const functionName = "mint";
    // const u64Option = tx.pure.option('u64', 100);  // 这里的100是你想传递的数字
    const u64Option = tx.pure.option('u64', 100);  // 这里的100是你想传递的数字
    console.log(`mintCoin account: ${u64Option}`);
    // const addressOption = tx.pure.address(address);  // 确保address是有效的字符串
    console.log(`target: ${packageId}::${moduleName}::${functionName}`);
    tx.moveCall({
        target: `${packageId}::${moduleName}::${functionName}`,
        arguments: [tx.object(treasuryCapId), tx.pure.u64(100), tx.pure.address(address)]
    });
    let result;
    try {
        console.log("mintCoin");
        result = await suiClient.signAndExecuteTransaction({
            transaction: tx,
            signer: keypair,
        });
        return result;
    } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
    }

    return result;
}