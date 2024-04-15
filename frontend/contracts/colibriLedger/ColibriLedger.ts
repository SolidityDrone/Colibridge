import { BigNumberish } from "ethers";
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_COLIBRI_LEDGER
export const selectors = {
  setupTransfer: 'setupTransfer',
  setUpWrap: 'setUpWrap',
  setUpUnwrap: 'setUpUnwrap',
  getBalance: 'getBalance',
}
export interface ColibriLedger {
  getBalance: (chainId: BigNumberish, account: string) => Promise<BigNumberish>;
  setUpUnwrap: (amount: BigNumberish, toChainId: BigNumberish, account: string) => Promise<void>;
  setUpWrap: (amount: BigNumberish, toChainId: BigNumberish, account: string) => Promise<void>;
  setupTransfer: (amount: BigNumberish, toChainId: BigNumberish, account: string, fromChainId: BigNumberish) => Promise<void>;
}

// wrapNativeEther() from user, then call setUpWrap()