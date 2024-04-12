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
use std::time::Duration;
use std::str::FromStr;
use alloy_primitives::{address, Address};
use alloy_sol_types::{sol, SolCall, SolValue};
use anyhow::{Context, Result};
use clap::Parser;
use erc20_methods::ERC20_GUEST_ELF;
use risc0_ethereum_view_call::{
    config::ARB_SEPOLIA_CHAIN_SPEC, ethereum::EthViewCallEnv, EvmHeader, ViewCall,
};
use risc0_zkvm::{compute_image_id, default_executor, is_dev_mode, ExecutorEnv, Receipt, serde::to_vec};
use tracing_subscriber::EnvFilter;
use host::{BonsaiProver};


/// Caller address
const CALLER: Address = address!("f08A50178dfcDe18524640EA6618a1f965821715");

sol! {
    /// ERC-20 balance function signature.
    interface IERC20 {
        function balanceOf(address account) external view returns (uint);
    }
}

/// Simple program to show the use of Ethereum contract data inside the guest.
#[derive(Parser, Debug)]
#[command(about, long_about = None)]
struct Args {
    /// URL of the RPC endpoint
    #[arg(short, long, env = "RPC_URL")]
    rpc_url: String,
    /// Contract address
    #[arg(short, long, env = "CONTRACT_ADDRESS")]
    contract_address: String,
    /// Account address
    #[arg(short, long, env = "ACCOUNT_ADDRESS")]
    account_address: String,

    #[arg(short, long, env = "AMOUNT_WEI")]
    amount: u64,
}

pub struct InputBuilder {
    input: Vec<u32>,
}

impl InputBuilder {
    pub fn new() -> Self {
        InputBuilder { input: Vec::new() }
    }

    pub fn write(mut self, input: impl serde::Serialize) -> Result<Self> {
        self.input.extend(to_vec(&input)?);
        Ok(self)
    }

    pub fn bytes(self) -> Vec<u8> {
        bytemuck::cast_slice(&self.input).to_vec()
    }
}

fn main() -> Result<()> {

    // Initialize tracing. In order to view logs, run `RUST_LOG=info cargo run`
    tracing_subscriber::fmt().with_env_filter(EnvFilter::from_default_env()).init();
    // parse the command line arguments
    let args = Args::parse();
    
    


    // Create a view call environment from an RPC endpoint and a block number. If no block number is
    // provided, the latest block is used. The `with_chain_spec` method is used to specify the
    // chain configuration.
    let from_chain_env =
        EthViewCallEnv::from_rpc(&args.rpc_url, None)?.with_chain_spec(&ARB_SEPOLIA_CHAIN_SPEC);
    let data_layer_env = 
        EthViewCallEnv::from_rpc(&args.rpc_url, None)?.with_chain_spec(&ARB_SEPOLIA_CHAIN_SPEC);
    
    let number = from_chain_env.header().number();
    let commitment = from_chain_env.block_commitment();

    let contract: Address = Address::from_str(&args.contract_address)?;
    let contract_address: Address = Address::from_str(&args.contract_address)?;
    let account_address: Address = Address::from_str(&args.account_address)?;

    let from_chain_call: IERC20::balanceOfCall =
        IERC20::balanceOfCall { account: account_address.clone() };
    let data_layer_call: IERC20::balanceOfCall =
        IERC20::balanceOfCall { account: account_address.clone() };


    let amount: u64 = args.amount;
    // Preflight the view call to construct the input that is required to execute the function in
    // the guest. It also returns the result of the call.
    let (from_chain_view_call_input, from_chain_returns) = ViewCall::new(from_chain_call, contract).with_caller(CALLER).preflight(from_chain_env)?;
    println!("For block {} `{}` returns: {}", number, IERC20::balanceOfCall::SIGNATURE, from_chain_returns._0);

    let (data_layer_view_call_input, data_layer_returns) = ViewCall::new(data_layer_call, contract).with_caller(CALLER).preflight(data_layer_env)?;
    println!("For block {} `{}` returns: {}", number, IERC20::balanceOfCall::SIGNATURE, data_layer_returns._0);

    
    println!("Running the guest with the constructed input:");
    let session_info = {
        let env = ExecutorEnv::builder()
            .write(&from_chain_view_call_input)
            .unwrap()
            .write(&data_layer_view_call_input)
            .unwrap()
            .write(&contract_address)
            .unwrap()
            .write(&account_address)
            .unwrap()
            .write(&amount)
            .unwrap()
            .build()
            .context("Failed to build exec env")?;
        let exec = default_executor();
        exec.execute(env, ERC20_GUEST_ELF).context("failed to run executor")?
    };
    
    let input = InputBuilder::new()
        .write(from_chain_view_call_input)
        .unwrap()
        .write(data_layer_view_call_input)
        .unwrap()
        .write(contract_address)
        .unwrap()
        .write(account_address)
        .unwrap()
        .write(amount)
        .unwrap()
        .bytes();
    
        BonsaiProver::prove(ERC20_GUEST_ELF, &input.to_vec())?;
        
        let (journal, post_state_digest, seal) = BonsaiProver::prove(ERC20_GUEST_ELF, &input)?;
        
    Ok(())
}


