import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
<<<<<<< HEAD
import { mainnet, sepolia } from 'wagmi/chains'
=======
import { sepolia, baseSepolia, polygonMumbai } from 'wagmi/chains'
>>>>>>> dev

// Get projectId at https://cloud.walletconnect.com
export const projectId = `${process.env.NEXT_PUBLIC_PROJECT_ID
}`
if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}



// Create wagmiConfig
<<<<<<< HEAD
const chains = [mainnet, sepolia] as const
=======
const chains = [sepolia, baseSepolia, polygonMumbai] as const
>>>>>>> dev
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  // ...wagmiOptions // Optional - Override createConfig parameters
})