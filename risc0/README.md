
# Commands  

## Build the project

Before stepping into building make sure you have risc0 installed in your systsem

```
cargo install cargo-binstall
cargo binstall cargo-risczero
cargo risczero install
```
When done, navigate ```zkvm/colibri``` and run or build
```
BONSAI_API_URL=http://api.bonsai.xyz BONSAI_API_KEY=<API_KEY> RPC_URL="Rpc url" FROM_CHAINID=11155111 CONTRACT_ADDRESS=02A5e7BFd1a3407150b2310dBc1f8C925B308A6b  ACCOUNT_ADDRESS=CAc3f7c8C771476251e93B44CB7afA0C2eDd5EB0 AMOUNT_WEI=1 RUST_LOG=info cargo run --release 

```
This will build and run a file located in target/release folder, in which you can 
## Query Bonsai for a snark
```
./publisher --rpc-url <Sepolia_RPC_URL> --from-chainid 1 --contract-address 02A5e7BFd1a3407150b2310dBc1f8C925B308A6b BONSAI_API_URL=http://api.bonsai.xyz --account-address CAc3f7c8C771476251e93B44CB7afA0C2eDd5EB0  --amount 1 --bonsai-key oY9BA55NkX4DpLUhm8x7a7TfzHoVNCaolYSSnCd0 --to-chainid 11155111
```
Await for return by bonsai 

[RISC Zero] is a zero-knowledge verifiable general computing platform, with [Ethereum] integration.
This repository contains [Solidity verifier contracts][contracts], [Relay], [View Call] library, and supporting libraries.

If you are looking to get started using RISC Zero in the application on Ethereum, the best place to look is the [Foundry template][template].

You can also find the documentation for RISC Zero, including guides for [writing zkVM programs][risc0-quickstart], [using the Bonsai prover][bonsai-quickstart], and more at [dev.risczero.com].

## Contracts

RISC Zero's Ethereum contracts, including the on-chain verifier, can be found in the [contracts] directory.

## Relay

The Relay is a service that can be run to accept proving requests from on-chain events or via REST Request, and post receipts to the developer's application contract as a callback.
It represents one way of accepting requests, and posting proofs to Ethereum.
It is also possible to write your application without using the Relay.

You can find and overview of how the Relay works, [in our documentation][relay-overview].
Source code for the Relay is in the [relay] directory.

## View Call
A library to query Ethereum state, or any other EVM-based blockchain state. It leverages the [alloy] library to make its use Solidity-friendly.


[RISC Zero]: https://github.com/risc0/risc0
[Ethereum]: https://ethereum.org/
[contracts]: ./contracts
[relay]: ./relay
[View Call]: ./view-call
[template]: https://github.com/risc0/bonsai-foundry-template
[dev.risczero.com]: https://dev.risczero.com
[risc0-quickstart]: https://dev.risczero.com/api/zkvm/quickstart
[bonsai-quickstart]: https://dev.risczero.com/api/bonsai/quickstart
[relay-overview]: https://dev.risczero.com/api/bonsai/bonsai-on-eth#bonsai-relay
[alloy]: https://github.com/alloy-rs
