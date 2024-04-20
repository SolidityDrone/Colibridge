import { ethers, parseEther } from 'ethers';
import { ColibriLedger, CONTRACT_ADDRESS as LEDGER_ADDRESS, selectors as ledgerSelector } from "../../../contracts/colibriLedger/ColibriLedger"
import { abi as ledgerAbi } from "../../../contracts/colibriLedger/colibriLedgerAbi"

export const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/sqbMARlPtLuVLPdS2JS2Gp7LV44mJYEZ");
export const privateKey = `${process.env.NEXT_PUBLIC_UH_PVK}`;
export const wallet = new ethers.Wallet(privateKey, provider);
export const callSetUpWrap = async (amount: string, toChainId: string, account: string) => {
  


    const contractAddress = `${LEDGER_ADDRESS}`;
    const contractABI = ledgerAbi as any; // Provide the ABI of your contract
    const contract = new ethers.Contract(contractAddress, contractABI, wallet) as unknown as ColibriLedger;
    const transaction = await contract.setUpWrap(parseEther(amount), toChainId, account)
    console.log("transaction", transaction)
}

export const callSetUpUnwrap = async (amount: string,  toChainId: string, account: string) => { 
    const contractAddress = `${LEDGER_ADDRESS}`;
    const contractABI = ledgerAbi as any; // Provide the ABI of your contract
    const contract = new ethers.Contract(contractAddress, contractABI, wallet) as unknown as ColibriLedger;
    const transaction = await contract.setUpUnwrap(parseEther(amount), toChainId, account)
    console.log("transaction", transaction)
}


export const callSetupTransfer = async (amount: string, toChainId: string, account: string, fromChainId: string) => {
    const contractAddress = `${LEDGER_ADDRESS}`;
    const contractABI = ledgerAbi as any; // Provide the ABI of your contract
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
  
    // Send the transaction
    const txPromise = contract.setupTransfer(
        parseEther(amount),
        toChainId,
        account,
        fromChainId
    );
    console.log("Transaction sent, waiting for confirmation...");
    const txReceipt = await txPromise;
    try {
        await txReceipt; 
    } catch (error) {
        console.error("Error waiting for transaction:", error);
        throw error;
    }
    return txReceipt; // Return the transaction receipt
}
