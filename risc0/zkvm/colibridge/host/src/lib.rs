
use std::time::Duration;

use alloy_primitives::FixedBytes;
use anyhow::{Context, Result};
use bonsai_sdk::alpha as bonsai_sdk;
use risc0_zkvm::{compute_image_id, Receipt};

pub struct BonsaiProver {}
impl BonsaiProver {
    /// Generates a snark proof as a triplet (`Vec<u8>`, `FixedBytes<32>`,
    /// `Vec<u8>) for the given elf and input.
    pub fn prove(elf: &[u8], input: &[u8]) -> Result<(/*Vec<u8>, FixedBytes<32>, Vec<u8>*/)> {
        
        let client = bonsai_sdk::Client::from_env(risc0_zkvm::VERSION)
        .expect("Failed to construct sdk client");

        let image_id = compute_image_id(elf).expect("Failed to compute image ID");
        let image_id_hex = hex::encode(image_id);
        client
            .upload_img(&image_id_hex, elf.to_vec())
            .expect("Failed to upload image");
        log::info!("Image ID: 0x{}", image_id_hex);
        

        let input_id = client.upload_input(input.to_vec())?;

        let assumptions: Vec<String> = vec![];
        let session = client.create_session(image_id.to_string(), input_id, assumptions)?;
        
        let _receipt = loop {
            let res = session.status(&client)?;
            if res.status == "RUNNING" {
                log::info!(
                    "Current status: {} - state: {} - continue polling...",
                    res.status,
                    res.state.unwrap_or_default()
                );
                std::thread::sleep(Duration::from_secs(30));
                continue;
            }
            if res.status == "SUCCEEDED" {
                // Download the receipt, containing the output.
                let receipt_url = res
                    .receipt_url
                    .context("API error, missing receipt on completed session")?;

                let receipt_buf = client.download(&receipt_url)?;
                let receipt: Receipt = bincode::deserialize(&receipt_buf)?;

                break receipt;
            }

            panic!(
                "Workflow exited: {} - | err: {}",
                res.status,
                res.error_msg.unwrap_or_default()
            );
        };

        // let snark = snark_receipt.snark;
        // log::debug!("Snark proof!: {snark:?}");

        // let seal = Seal::abi_encode(snark).context("Read seal")?;
        // let post_state_digest: FixedBytes<32> = snark_receipt
        //     .post_state_digest
        //     .as_slice()
        //     .try_into()
        //     .context("Read post_state_digest")?;
        // let journal = snark_receipt.journal;

        Ok(())
            
        }
}