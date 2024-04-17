'use client'
import {
  Bars3Icon
} from '@heroicons/react/24/outline'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Image from "next/image";
import { useAccount } from 'wagmi';





export default function Example() {
  const { open } = useWeb3Modal()
  const { status, address } = useAccount()
  return (
    <header className="bg-dark text-withe-900">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 text-white-900" aria-label="Global">
        <div className="flex lg:flex-1 text-white-900">
          <a href="/" >
             <Image
              className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
              src="/colibridge-logos/colibri-negtive.svg"
              alt="Next.js Logo"
              width={100}
              height={70}
              priority
            />
          </a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {
            address ?
            <>
            <button className="px-4 py-2 text-sm font-semibold leading-6 text-withe-900" onClick={() => open()}>Wallet {address.substring(0,5)}...</button>
              </>
            :
            <>
            <button className="px-4 py-2 text-sm font-semibold leading-6 text-withe-900" onClick={() => open()}>Connect Wallet</button>
            </>
          }
          {" "}
          <button className="text-sm font-semibold  text-withe-900" onClick={() => open({ view: 'Networks' })}>Switch Network</button>
        </div>
      </nav>
    </header>
  )
}
