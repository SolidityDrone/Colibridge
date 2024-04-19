'use client'
import Image from "next/image";
import Link from "next/link";
<<<<<<< HEAD
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { abi as wrapperAbi } from "../../../contracts/ERC20Wrapper/erc20wrapperAbi"


import { CONTRACT_ADDRESS as WRAPPER_ADDRESS, selectors as wrapperSelectors } from "../../../contracts/ERC20Wrapper/colibriERC20Wrapper"
import { parseEther } from "ethers";
import { useEffect, useState } from "react";
import { callSetUpWrap } from "../api/routes";
=======
import { useWriteContract, useReadContract, useChainId, useAccount, useWaitForTransactionReceipt, BaseError } from 'wagmi'
import { abi as wrapperAbi } from "../../../contracts/ERC20Wrapper/erc20wrapperAbi"
import { abi as ledgerAbi } from "../../../contracts/colibriLedger/colibriLedgerAbi"
import { CONTRACT_ADDRESS as WRAPPER_ADDRESS, selectors as wrapperSelectors } from "../../../contracts/ERC20Wrapper/colibriERC20Wrapper"
import { parseEther, ethers } from "ethers";
import { use, useEffect, useState } from "react";
import { callSetUpWrap } from "../api/routes";
import DotsAnimation from "../components/common/DotsAnimation";
import { ColibriLedger, CONTRACT_ADDRESS as LEDGER_ADDRESS, selectors as ledgerSelector } from "../../../contracts/colibriLedger/ColibriLedger"



>>>>>>> dev

export default function CreateWrapper() {
  const [successDone, setSuccessDone] = useState<boolean>()
  const [amount, setAmount] = useState('0')
<<<<<<< HEAD
  const { writeContract, data } = useWriteContract({
  })
  const { address } = useAccount()

  const resp = useWaitForTransactionReceipt({
    hash: data,
  })


  useEffect(() => {
    if (resp.isSuccess && !successDone) {
      setSuccessDone(true)
      // send tx under hood to ledger contract on IPC
      alert('succes')

      // return writeContract({
      //   abi: ledgerAbi,
      //   address: `${LEDGER_ADDRESS}` as `0x${string}`,
      //   functionName: ledgerSelector.setUpWrap,
      //   args: [],
      //   value: parseEther(amount) as any
      // })

      callSetUpWrap(amount, address as string)
    }
  }, [resp])

  const wrapETH = async () => {
    return writeContract({
      abi: wrapperAbi,
      address: `${WRAPPER_ADDRESS}` as `0x${string}`,
      functionName: wrapperSelectors.wrapNativeEther,
      args: [],
      value: parseEther(amount) as any
    })
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      </div>

      <div className="max-w-sm mx-auto">
        <label htmlFor="number-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Chose ETH amount you want to wrap</label>
        <input type="number" id="number-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="90210" required onChange={(el) => setAmount(el.target.value)} />
        <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => wrapETH()}>Wrap some ETH</button>
      </div>


      <div className="mb-32 flex text-center justify-around  lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-2 lg:text-left">

        <Link
          key={"Back"}
          href={"/"}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Back{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            </span>
            -&gt;
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Go back to the home page
          </p>
        </Link>

        <Link
          key={"Bridge"}
          href={"/bridge"}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Bridge{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Bridge token with a single transaction.
          </p>
        </Link>

      </div>
    </main>
  );
}
=======
  const [currentStep, setCurrentStep] = useState(0)
  const { address } = useAccount()
  const chainId = useChainId()
  const [balance, setBalance] = useState("")

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

  const {
    data: hash,
    isPending,
    error,
    writeContract
  } = useWriteContract()


  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })


  useEffect(() => {
    const setupTransferAndTimeout = async () => {
      if (isConfirmed) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await callSetUpWrap(amount, chainId.toString(), address as string);
        setCurrentStep(4)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setCurrentStep(0)
      }
    };
    setupTransferAndTimeout();

  }, [isConfirmed]);


  useEffect(() => {
    if (isPending) {
      setCurrentStep(1)
    }
    if (isConfirming) {
      setCurrentStep(2)
    }
    if (isConfirmed) {
      setCurrentStep(3)
    }
  }, [isPending, isConfirming, isConfirmed])



  const wrapETH = async () => {
    try {
      writeContract({
        abi: wrapperAbi,
        address: `${WRAPPER_ADDRESS}` as `0x${string}`,
        functionName: wrapperSelectors.wrapNativeEther,
        args: [],
        value: parseEther(amount) as any
      })
    } catch (error) {
      console.error("Error waiting for transaction:", error);
      
      throw error;
    }
  }



  return (
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
                  <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">Wrapping your ether</h3>
                  {currentStep === 1 && (
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Awaiting user transaction<DotsAnimation /></p>
                  )}
                  {currentStep === 2 && (
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Confirming transaction<DotsAnimation /></p>
                  )}
                  {currentStep === 3 && (
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Sending signal to data layer<DotsAnimation /></p>
                  )}
                  {currentStep === 4 && (
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Transactions are confirmed</p>
                  )}
                  <div className="flex justify-between mb-1 text-gray-500 dark:text-gray-400">
                    <span className="text-base font-normal"></span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{currentStep - 1} of 3 steps</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${((currentStep - 1) / 3) * 100}%`, transition: 'width 0.3s ease-in-out' }}></div>
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
      <div className="grid grid-cols-9 gap-1 mb-4 w-full shadow dark:bg-gray-1000 backdrop-blur-xl dark:border-neutral-800 dark:bg-zinc-600/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-100 lg:p-4 lg:dark:bg-zinc-00/30">
        
          
        <div className="col-span-4 bg-gradient-to-r from-purple-200 to-blue-300 shadow dark:bg-gray-1000 backdrop-blur-xl dark:border-neutral-800 dark:bg-zinc-600/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-100 lg:p-4 lg:dark:bg-zinc-00/30">

          <div className="z-10  max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col items-center">
          <h1  className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">Wrap</h1>

          </div>
          <div className="max-w-sm w-full mx-auto mt-4">
            <div className="grid grid-cols-8 gap-1 mb-4 w-full">
              <div className="col-span-1"></div>
              <div className="col-span-4">
                <input type="number" id="number-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="set amount to wrap" required onChange={(el) => setAmount(el.target.value)} />
              </div>
              <div className="col-span-2">
                <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => wrapETH()}> Wrap</button>
              </div>
            </div>
          </div>
        
        </div>
        <div className="col-span-1"></div>
        <div className="col-span-4 bg-gradient-to-l from-emerald-100 to-blue-300 shadow dark:bg-gray-1000 backdrop-blur-xl dark:border-neutral-800 dark:bg-zinc-600/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-100 lg:p-4 lg:dark:bg-zinc-00/30">

          <div className="z-10  max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col items-center">
            <h1  className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">Unwrap</h1>

          
          </div>
          <div className="max-w-sm w-full mx-auto mt-4">
            <div className="grid grid-cols-8 gap-1 mb-4 w-full">
              <div className="col-span-1"></div>
              <div className="col-span-4 ">
                <input type="number" id="number-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="set amount to unwrap" required onChange={(el) => setAmount(el.target.value)} />
              </div>
              <div className="col-span-2">
                <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => wrapETH()}> Unwrap</button>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="mb-16 flex text-center justify-around  lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-2 lg:text-left">
  
      
      </div>

    </main>
  );
}
>>>>>>> dev
