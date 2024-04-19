'use client'
import Link from "next/link";
import { useWriteContract, useAccount, useChainId, useWaitForTransactionReceipt, BaseError, useReadContract } from 'wagmi'
import { abi } from "../../../contracts/ERC20Wrapper/erc20wrapperAbi"
import { abi as ledgerAbi } from "../../../contracts/colibriLedger/colibriLedgerAbi"
import { ColibriLedger, CONTRACT_ADDRESS as LEDGER_ADDRESS, selectors as ledgerSelector } from "../../../contracts/colibriLedger/ColibriLedger"
import { CONTRACT_ADDRESS, selectors } from "../../../contracts/ERC20Wrapper/colibriERC20Wrapper"
import { hexlify, parseEther } from "ethers";
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import { callSetupTransfer } from "../api/routes";
import DotsAnimation from "../components/common/DotsAnimation";
import { useWeb3Modal } from '@web3modal/wagmi/react'

const rpc_url = "https://eth-sepolia.g.alchemy.com/v2/sqbMARlPtLuVLPdS2JS2Gp7LV44mJYEZ"
const from_chainid = "1"
const to_chainid = "1"
const contract_address = "8508DE326D01219f6FC2e45378601f08ec743750"
const account_address= "CAc3f7c8C771476251e93B44CB7afA0C2eDd5EB0"
const amount = "100"
const bonsai_key = "oY9BA55NkX4DpLUhm8x7a7TfzHoVNCaolYSSnCd0"



interface ParsedResponse {
  image_id: string;
  journal: string;
  post_state_digest: string;
  seal_hex: string;
}

function parseResponse(response: any): ParsedResponse {
  return {
      image_id: response.image_id,
      journal: response.journal,
      post_state_digest: response.post_state_digest,
      seal_hex: response.seal_hex
  };
}

async function callPublisherAPI(
  rpc_url: string,
  from_chainid: string,
  to_chainid: string,
  contract_address: string,
  account_address: string,
  amount: string,
  bonsai_key: string
): Promise<ParsedResponse> {
  try {
    const url = 'https://193.123.68.104:5004/publish';
    const data = {
          rpc_url,
          from_chainid,
          to_chainid,
          contract_address,
          account_address,
          amount,
          bonsai_key
      };
      console.log(url)
      console.log(JSON.stringify(data))
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });
      if (!response.ok) {
         // throw new Error(HTTP error! Status: ${response.status});
      }

      const responseData = await response.json();
      return parseResponse(responseData);
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}


export default function Bridge() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState("");
  const address = useAccount().address;
  const [balance, setBalance] = useState("")
  const { open } = useWeb3Modal()
  const {
    data: hash,
    isPending,
    error,
    writeContract
  } = useWriteContract()
  const chainId = useChainId()
  const BridgeETH = async () => {
    try {
      setCurrentStep(1);
      //await callSetupTransfer("1", "1", address!.toString(), "1");
      //await new Promise(resolve => setTimeout(resolve, 13000));
      setCurrentStep(2);

      // Read api here
    //  await new Promise(resolve => setTimeout(resolve, 10000));
      setCurrentStep(3);

      const arg1 = hexlify("0x0a9df29a81c1d46c996a2ebe801a094c8fbf8ff7d7476a5e144ac55a262210290f6986d06aabf95c0018d3ab48a90ba34bad8778e87cc572fbf3b36fa137f1511e90f97bc01ffa741c10d0335e6df206b311d4fd6579468e27346212ddf1fe9e244e363057358cbbf0661ba42ea3459a69328e6520c93f5a158d52ac183e2b7028bd1dc04d0e470fdb450813e97fcc12f6534346cd854478ec0ba4640545f4312d935c66756c7ec519a087b68340de4c1c24de2e4b7b6441bee29592fcb689162e9a6c1d5c60c414b7046ba1b555bfe459de7d86b1fe367903b9314880432eb4223745de2a3758ecfc13c15561d6ca56728ea312694cfcc03fcd569ba9726e53");
      const arg2 = hexlify("0x34ffbe0c65d140cf251b3c0892cd7a3d575ac4c0fbe1de6f058fd99d6f9ad9e0");
      const arg3 = hexlify("0x1032f5f2b9256a9c1f2034406da68ec6c6e9cb6206e118b2a6153a05e02e66d2");
      const arg4 = hexlify("0x00000000000000000000000000000000000000000000000000000000000027100000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f08a50178dfcde18524640ea6618a1f965821715");

      callPublisherAPI(rpc_url,from_chainid,to_chainid,contract_address,account_address,amount,bonsai_key)
      .then((parsedResponse) => {
        console.log(parsedResponse);
      }).catch((error) => {
          console.error('Error:', error);
      });


      writeContract({
        abi: abi,
        address: `${CONTRACT_ADDRESS}` as `0x${string}`,
        functionName: selectors.mintWithRiscZeroProof,
        args: [arg1, arg2, arg3, arg4]
      });
      

    } catch (error) {
      setCurrentStep(0);
      console.error(error);
    }
  };


  useEffect(() => {
    if (error) {
      setCurrentStep(0);
    }
  }, [error]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })


  useEffect(() => {
    const setupTransferAndTimeout = async () => {
      if (isConfirmed) {
        setCurrentStep(4);
        await callSetupTransfer("1", "1", address!.toString(), "1");
        await new Promise(resolve => setTimeout(resolve, 3000));
        setCurrentStep(5);

        const timeout = setTimeout(() => {
          setCurrentStep(0);
        }, 5000);

        return () => clearTimeout(timeout);
      }
    };

    setupTransferAndTimeout();

  }, [isConfirmed, setCurrentStep, address, callSetupTransfer]);



  const { data: result } = useReadContract({
    abi: ledgerAbi,
    address: `${LEDGER_ADDRESS}` as `0x${string}`,
    functionName: 'getBalanceAndNonce',
    chainId: 11155111,
    args: [chainId, address]
  });

  useEffect(() => {
    if (result) {
      let bal = result[0];
      let balanceWeth = ethers.formatEther(bal)
      setBalance(balanceWeth);
    }
  }, [result]);

  useEffect(() => {
    console.log("Updated balance:", balance);
  }, [balance]);
  return (
    <>

<main className="flex bg-gradient-to-b from-gray-400 to-blue-300 flex-col items-center justify-between p-12" style={{ height: '90vh' }}>
        {currentStep > 0 && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 z-40">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 py-32 px-80 rounded-lg shadow-md">

              <div id="progress-modal" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">



                <div className="relative bg-bloack rounded-lg shadow dark:bg-gray-700">

                  <div className="p-4 md:p-5">
                    <svg className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                      <path d="M8 5.625c4.418 0 8-1.063 8-2.375S12.418.875 8 .875 0 1.938 0 3.25s3.582 2.375 8 2.375Zm0 13.5c4.963 0 8-1.538 8-2.375v-4.019c-.052.029-.112.054-.165.082a8.08 8.08 0 0 1-.745.353c-.193.081-.394.158-.6.231l-.189.067c-2.04.628-4.165.936-6.3.911a20.601 20.601 0 0 1-6.3-.911l-.189-.067a10.719 10.719 0 0 1-.852-.34 8.08 8.08 0 0 1-.493-.244c-.053-.028-.113-.053-.165-.082v4.019C0 17.587 3.037 19.125 8 19.125Zm7.09-12.709c-.193.081-.394.158-.6.231l-.189.067a20.6 20.6 0 0 1-6.3.911 20.6 20.6 0 0 1-6.3-.911l-.189-.067a10.719 10.719 0 0 1-.852-.34 8.08 8.08 0 0 1-.493-.244C.112 6.035.052 6.01 0 5.981V10c0 .837 3.037 2.375 8 2.375s8-1.538 8-2.375V5.981c-.052.029-.112.054-.165.082a8.08 8.08 0 0 1-.745.353Z" />
                    </svg>
                    <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">Setting up your claim </h3>

                    {currentStep === 1 && (
                      <p className="text-gray-500 dark:text-gray-400 mb-6">Writing intent on data layer  <DotsAnimation /></p>
                    )}
                    {currentStep === 2 && (
                      <p className="text-gray-500 dark:text-gray-400 mb-6">Awaiting snark from bonsai  <DotsAnimation /></p>
                    )}
                    {currentStep === 3 && isPending && (
                      <p className="text-gray-500 dark:text-gray-400 mb-6">Waiting user transaction  <DotsAnimation /></p>
                    )}
                    {currentStep === 3 && isConfirming && (
                      <p className="text-gray-500 dark:text-gray-400 mb-6">Confirming transaction  <DotsAnimation /></p>
                    )}
                    {isConfirmed && (
                      <p className="text-gray-500 dark:text-gray-400 mb-6">Writing claim on data layer  <DotsAnimation /></p>
                    )}

                    <div className="flex justify-between mb-1 text-gray-500 dark:text-gray-400">
                      <span className="text-base font-normal"></span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{currentStep - 1} of 4 steps</span>

                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${((currentStep - 1) / 4) * 100}%`, transition: 'width 0.3s ease-in-out' }}></div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}
 
   <div className="col-span-1"></div>
          <div className=" bg-gradient-to-r from-purple-200 to-blue-300 shadow dark:bg-gray-1000 backdrop-blur-xl dark:border-neutral-800 dark:bg-zinc-600/30 dark:from-inherit   lg:rounded-xl lg:border lg:bg-gray-100 lg:p-4 lg:dark:bg-zinc-00/30">
    <h1>Chain id: {chainId.toString()}</h1>
    <h1>Ledger Balance: {balance.toString()} Ether</h1>

    </div>
          <div className="grid grid-cols-8 gap-1 mb-4 w-full shadow dark:bg-gray-1000 backdrop-blur-xl dark:border-neutral-800 dark:bg-zinc-600/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-100 lg:p-4 lg:dark:bg-zinc-00/30">
        
          
        <div className="col-span-4 bg-gradient-to-r from-purple-200 to-blue-300 shadow dark:bg-gray-1000 backdrop-blur-xl dark:border-neutral-800 dark:bg-zinc-600/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-100 lg:p-4 lg:dark:bg-zinc-00/30">
        <div className="col-span-2">
              <input type="number" id="number-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="amount to activate" required />
            </div>
      
          
        </div>
        
        <div className="col-span-4 bg-gradient-to-l from-emerald-100 to-blue-300 shadow dark:bg-gray-1000 backdrop-blur-xl dark:border-neutral-800 dark:bg-zinc-600/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-100 lg:p-4 lg:dark:bg-zinc-00/30">
        
         <div className="col-span-1">
              <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => BridgeETH()}>Submit</button>
             
              <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => open({ view: 'Networks' })}>Switch Network</button>
     
          </div>
     
          

        </div>
      </div>
        <div className=" w-full">
          <div className="grid grid-cols-12 gap-4 mb-4 w-full">

            <div className="col-span-4"></div>
          
        
         </div>
        </div>

        <div className="mb-32 flex text-center justify-around  lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-2 lg:text-left">
      
        </div>
      </main>
    </>
  );
}