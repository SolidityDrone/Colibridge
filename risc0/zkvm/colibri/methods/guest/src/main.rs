// Copyright 2024 RISC Zero, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#![allow(unused_doc_comments)]
#![no_main]
use std::convert::TryInto;
use alloy_primitives::{address, Address, Uint};
use alloy_sol_types::{sol, SolValue};
use risc0_ethereum_view_call::{
    config::*, ethereum::EthViewCallInput, ViewCall,
};
use risc0_zkvm::guest::env;

risc0_zkvm::guest::entry!(main);

/// Specify the function to call using the [`sol!`] macro.
/// This parses the Solidity syntax to generate a struct that implements the [SolCall] trait.
/// The struct instantiated with the arguments can then be passed to the [ViewCall] to execute the
/// call. For example:
/// `IERC20::balanceOfCall { account: address!("9737100D2F42a196DE56ED0d1f6fF598a250E7E4") }`
sol! {
    interface COLIBRILEDGER{
        function getBalanceAndNonce(uint chainid, address account) external view returns (uint, uint);
    }
}

alloy_sol_types::sol! {
    struct Output {
        uint amount;
        uint to_chainid;
        uint nonce;
        address account;
    }
}
/// Address of the caller of the function. If not provided, the caller will be the [CONTRACT].
const CALLER: Address = address!("f08A50178dfcDe18524640EA6618a1f965821715");

fn main() {
    // Read the input from the guest environment.
    let data_layer_view_call_input: EthViewCallInput = env::read();
    let contract_address: Address = env::read();
    let account_address: Address = env::read();
    let amount: u64 = env::read();
    let from_chainid: u64 = env::read();
    let to_chainid: u64 = env::read();
        let data_layer_call:  COLIBRILEDGER::getBalanceAndNonceCall =
        COLIBRILEDGER::getBalanceAndNonceCall {chainid: Uint::from(from_chainid.clone()), account: account_address.clone() };

    // Converts the input into a `ViewCallEnv` for execution. The `with_chain_spec` method is used
    // to specify the chain configuration. It checks that the state matches the state root in the
    // header provided in the input.
  
    let data_layer_view_call_env = data_layer_view_call_input.into_env().with_chain_spec(&ETH_SEPOLIA_CHAIN_SPEC);
    
    
    // Execute the view call; it returns the result in the type generated by the `sol!` macro.
    
    let data_layer_returns = ViewCall::new(data_layer_call, contract_address).with_caller(CALLER).execute(data_layer_view_call_env);
    println!("Balance on dl: {}", data_layer_returns._0);
    println!("Nonce on dl: {}", data_layer_returns._1);
    println!("Address to check: {}", account_address);

    let data_layer_returns_u64: u64 = match data_layer_returns._0.try_into() {
        Ok(value) => value,
        Err(_) => {
            // Handle the conversion error here
            // For example, you could panic, return a default value, or handle it gracefully
            panic!("Conversion from alloy_primitives::Uint<256, 4> to u64 failed");
        }
    };

    let data_layer_returns_nonce_u64: u64 = match data_layer_returns._1.try_into() {
        Ok(value) => value,
        Err(_) => {
            // Handle the conversion error here
            // For example, you could panic, return a default value, or handle it gracefully
            panic!("Conversion from alloy_primitives::Uint<256, 4> to u64 failed");
        }
    };

    assert!(amount.clone() <= data_layer_returns_u64.clone(), "from_chain_returns is less than amount");
    
    let output = Output {
        amount: Uint::from(amount.clone()),
        to_chainid: Uint::from(to_chainid.clone()),
        nonce: Uint::from(data_layer_returns_nonce_u64.clone()),
        account: account_address.clone(),
    };

    println!("Output: {:?}", output.abi_encode());   
    env::commit_slice(output.abi_encode().as_slice());
    
}

