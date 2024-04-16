import { BigNumberish, BytesLike } from "ethers";
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_COLIBRI_ERC20_WRAPPER

export const selectors = {
  allowance: 'allowance',
  balanceOf: 'balanceOf',
  decimals: 'decimals',
  name: 'name',
  symbol: 'symbol',
  totalSupply: 'totalSupply',
  approve: 'approve',
  transfer: 'transfer',
  transferFrom: 'transferFrom',
  unwrapNativeEther: 'unwrapNativeEther',
  wrapNativeEther: 'wrapNativeEther',
  mintWithRiscZeroProof: 'mintWithRiscZeroProof'
}
export interface ColibriERC20Wrapper {


  // View Functions
  allowance: (owner: string, spender: string) => Promise<BigNumberish>;
  balanceOf: (account: string) => Promise<BigNumberish>;
  decimals: () => Promise<number>;
  name: () => Promise<string>;
  symbol: () => Promise<string>;
  totalSupply: () => Promise<BigNumberish>;

  // Non-payable Functions
  approve: (spender: string, value: BigNumberish) => Promise<boolean>;
  transfer: (to: string, value: BigNumberish) => Promise<boolean>;
  transferFrom: (from: string, to: string, value: BigNumberish) => Promise<boolean>;
  unwrapNativeEther: (amount: BigNumberish) => Promise<void>;

  // Payable Functions
  wrapNativeEther: () => Promise<void>;

  mintWithRiscZeroProof: (seal: BytesLike, imageId: BytesLike, postStateDigest: BytesLike, journal: BytesLike) => Promise<void>;
}