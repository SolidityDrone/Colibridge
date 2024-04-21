
# Colibri

Colibri is a tool to create verifiable omni-chain balances. It's a project created for [Scaling Ethereum 2024 Hackathon](https://ethglobal.com/events/scaling2024).

## How does it works?
Colibri works with Risc0 and IPC.
Users need to create a wrapped token representing the balance of a user for a certain token.

Then Colibri asks risc0 to create a proof of balance.

Colibri wirtes the Balance to an IPC subnet, created ad-hoc for this reason. This subnet is highly customizable and it's perfect for this scope.

On other chains, colibri asks risc0 again to verify the balances on all the other chain and IPC subnets.

### More detailed info (read this if you're a nerd)
Colibri has a system where a bunch of colibri-wrapper contracts are deployed on various networks. (In our case we use few testnet networks like sepolia and base).

We also leverage IPC custom subnet to use as a unified ledger, storing omnichain balances. 

Every time an asset gets wrapped the user will need a risc0+bonsai operation to return a snark required for the transaction to go trough. 
The risc0 proofs are needed for prooving that  data across chains has correctly been viewed, these proofs are ultimately converted from stark2snark and returned to our application so he can either write on balance or prompt a transaction for the user with the SNARK args.

The goal of the project is to create a provable omnichain balance and seek alternatives in bridging operations, ultimately trying to achieve such in just a tx on the destination chain, without having to interpel the fromChain

## Flow
Here is the flow of the app:

<img width="713" alt="Schermata 2024-04-19 alle 10 26 30" src="https://github.com/SolidityDrone/Colibridge/assets/46995085/4a39e4a2-0d33-4821-8eef-6543dd995d60">


## How to use it

clone the repo
```bash
git clone https://github.com/SolidityDrone/Colibridge.git
```

start the front end
```bash
cd next && yarn && yarn dev
```

## How is it made?
We have several components:

### Smart Contracts
ColibriLedger.sol: deployed on IPC subnet. used as unified ledger for Colibri.
ColibriWrapper.sol: Deployed on all the other networks. Allows to wrap the tokens user want to take in account for the omni-chain balance

- [Arbitrum Sepolia Wrapper](https://sepolia.arbiscan.io/address/0xa4c5660914D499D0Ccdb90c294C16BB9FeffC741)
- [Sepolia Wrapper](https://sepolia.etherscan.io/address/0xccfbceaf7d49225905b82f800b5c014f98c490d8)

### Risc0:
Using Risc0 to create proofs necessary to verify the balances of the users

### IPC subnets
Using a IPC Subnet to deploy our ColibriLedger.sol; It is very convenient as it fully customizable and it's used only to store users balances.
Here are the result of our deployment: 
![image](https://github.com/SolidityDrone/Colibridge/assets/104315978/231ab904-1e59-4e56-810e-f59ba0017720)

The Ledger contract is deployed on this net at address: [0x7e8C72E41C849B6671a508AF89B1c7A7AF3cb525]()
