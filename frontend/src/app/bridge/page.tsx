'use client'
import Link from "next/link";
import {  useWriteContract } from 'wagmi'
import {abi} from "../../../contracts/ERC20Wrapper/erc20wrapperAbi"
import {CONTRACT_ADDRESS, selectors} from "../../../contracts/ERC20Wrapper/colibriERC20Wrapper"
import { hexlify, parseEther } from "ethers";

export default function Bridge() {
  const { writeContractAsync } = useWriteContract()
    //TODO select the startingnetwork 
    const BridgeETH = async () => {
      const arg1 = hexlify("0x0a9df29a81c1d46c996a2ebe801a094c8fbf8ff7d7476a5e144ac55a262210290f6986d06aabf95c0018d3ab48a90ba34bad8778e87cc572fbf3b36fa137f1511e90f97bc01ffa741c10d0335e6df206b311d4fd6579468e27346212ddf1fe9e244e363057358cbbf0661ba42ea3459a69328e6520c93f5a158d52ac183e2b7028bd1dc04d0e470fdb450813e97fcc12f6534346cd854478ec0ba4640545f4312d935c66756c7ec519a087b68340de4c1c24de2e4b7b6441bee29592fcb689162e9a6c1d5c60c414b7046ba1b555bfe459de7d86b1fe367903b9314880432eb4223745de2a3758ecfc13c15561d6ca56728ea312694cfcc03fcd569ba9726e53");
      const arg2 = hexlify("0x34ffbe0c65d140cf251b3c0892cd7a3d575ac4c0fbe1de6f058fd99d6f9ad9e0");
      const arg3 = hexlify("0x1032f5f2b9256a9c1f2034406da68ec6c6e9cb6206e118b2a6153a05e02e66d2");
      const arg4 = hexlify("0x00000000000000000000000000000000000000000000000000000000000027100000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f08a50178dfcde18524640ea6618a1f965821715");
    return writeContractAsync({
      abi: abi,
      address:`${CONTRACT_ADDRESS}` as `0x${string}`,
      functionName: selectors.mintWithRiscZeroProof,
      args: [arg1,arg2,arg3,arg4]
    })
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      </div>

      <div className="max-w-sm mx-auto">
        <label htmlFor="number-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bridge oETH to another network with just one transaction, select amount and network</label>
        <input type="number" id="number-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="90210" required />
        <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={()=> BridgeETH()}>Bridge some oETH</button>
      </div>

      <div className="mb-32 flex text-center justify-around  lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-2 lg:text-left">
 <Link
          key={"Create Wrapper"}
          href={"/create-wrapper"}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
        <h2 className="mb-3 text-2xl font-semibold">
          Create Wrapper{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className="m-0 max-w-[30ch] text-sm opacity-50">
          Create a special ERC20 token to bridge.
        </p>
        </Link>
        
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

      

      </div>
    </main>
  );
}
