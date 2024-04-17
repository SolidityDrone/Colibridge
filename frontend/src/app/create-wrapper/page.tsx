'use client'
import Image from "next/image";
import Link from "next/link";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId} from 'wagmi'
import { abi as wrapperAbi } from "../../../contracts/ERC20Wrapper/erc20wrapperAbi"


import { CONTRACT_ADDRESS as WRAPPER_ADDRESS, selectors as wrapperSelectors } from "../../../contracts/ERC20Wrapper/colibriERC20Wrapper"
import { parseEther } from "ethers";
import { useEffect, useState } from "react";
import { callSetUpWrap } from "../api/routes";

export default function CreateWrapper() {
  const [successDone, setSuccessDone] = useState<boolean>()
  const [amount, setAmount] = useState('0')
  const { writeContract, data } = useWriteContract({
  })
  const { address } = useAccount()
  const chainId = useChainId()
  const resp = useWaitForTransactionReceipt({ 
    hash: data,
  })


  useEffect(() => {
    if (resp.isSuccess && !successDone) {
      setSuccessDone(true)
      // send tx under hood to ledger contract on IPC
      alert('success')

      // // return writeContract({
      // //   abi: ledgerAbi,
      // //   address: `${LEDGER_ADDRESS}` as `0x${string}`,
      // //   functionName: ledgerSelector.setUpWrap,
      // //   args: [],
      // //   value: parseEther(amount) as any
      // // })

      callSetUpWrap(amount, chainId.toString(), address as string)
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
    <main className="flex flex-col items-center justify-between p-12" style={{ height: '80vh' }}>
      <div className="z-10 w-full h-3 max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      </div>

      <div className="max-w-sm mx-auto mt-4">
        <label htmlFor="number-input" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Chose ETH amount you want to wrap</label>
        <input type="number" id="number-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="90210" required onChange={(el) => setAmount(el.target.value)} />
        <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
           onClick={() => wrapETH()}>Wrap some ETH
        </button>
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
