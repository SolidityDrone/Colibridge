'use client'
import Image from "next/image";
import Link from "next/link";
import { useWriteContract, useChainId, useAccount, useWaitForTransactionReceipt, BaseError} from 'wagmi'
import { abi as wrapperAbi } from "../../../contracts/ERC20Wrapper/erc20wrapperAbi"

import { CONTRACT_ADDRESS as WRAPPER_ADDRESS, selectors as wrapperSelectors } from "../../../contracts/ERC20Wrapper/colibriERC20Wrapper"
import { parseEther } from "ethers";
import { use, useEffect, useState } from "react";
import { callSetUpWrap } from "../api/routes";
import DotsAnimation from "../components/common/DotsAnimation";
export default function CreateWrapper() {
  const [successDone, setSuccessDone] = useState<boolean>()
  const [amount, setAmount] = useState('0') 
  const [currentStep, setCurrentStep] = useState(0)
  const { address } = useAccount()
  const chainId = useChainId()


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
        await new Promise(resolve => setTimeout(resolve, 4000));
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
    if (isConfirmed){
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
    <main className="flex flex-col items-center justify-between p-12" style={{ height: '80vh' }}>
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
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col items-center">
          <p className="fixed left-0 top-0 w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            <label htmlFor="number-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choose the amount you want to wrap</label>
          </p>
        </div>
      <div className="max-w-sm w-full mx-auto mt-4">
      <div className="grid grid-cols-8 gap-1 mb-4 w-full">
        <div className="col-span-1"></div>
          <div className="col-span-4">
          <input type="number" id="number-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="90210" required onChange={(el) => setAmount(el.target.value)} />
            </div>
              <div className="col-span-2">
              <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              onClick={() => wrapETH()}> Wrap
              </button>
            </div>
        </div>
      </div>
      <div className="mb-16 flex text-center justify-around  lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-2 lg:text-left">
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
