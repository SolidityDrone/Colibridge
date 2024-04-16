import { ethers, parseEther } from 'ethers';
import { ColibriLedger, CONTRACT_ADDRESS as LEDGER_ADDRESS, selectors as ledgerSelector } from "../../../contracts/colibriLedger/ColibriLedger"
import { abi as ledgerAbi } from "../../../contracts/colibriLedger/colibriLedgerAbi"
export const callSetUpWrap = async (amount: string, account: string) => {
  const provider = new ethers.JsonRpcProvider("https://arb-sepolia.g.alchemy.com/v2/DUfgkhHL801ItpL6NGIogTLy_X8yiPtK");
    const privateKey = `${process.env.NEXT_PUBLIC_UH_PK}`;
    const wallet = new ethers.Wallet(privateKey,provider);

    const contractAddress = `${LEDGER_ADDRESS}`;
    const contractABI = ledgerAbi as any; // Provide the ABI of your contract
    const contract = new ethers.Contract(contractAddress, contractABI, wallet) as unknown as ColibriLedger;
    debugger
    const transaction = await contract.setUpWrap(parseEther(amount), 11155111, account)
    console.log("transaction", transaction)

}