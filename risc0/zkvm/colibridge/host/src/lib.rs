
use std::time::Duration;
use alloy_primitives::FixedBytes;
use anyhow::{Context, Result, ensure};
use bonsai_sdk::alpha as bonsai_sdk;
use risc0_zkvm::{compute_image_id, Receipt};

pub struct BonsaiProver {}
use alloy_primitives::U256;
use alloy_sol_types::{sol, SolValue};
use risc0_zkvm::Groth16Seal;


sol! {
    /// Groth16 seal construction from [RiscZeroGroth16Verifier.sol].
    ///
    /// [RiscZeroGroth16Verifier.sol]: https://github.com/risc0/risc0/blob/v0.20.1/bonsai/ethereum/contracts/groth16/RiscZeroGroth16Verifier.sol#L76-L81
    #[derive(Debug)]
    struct Seal {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
    }
}

impl Seal {
    /// ABI encoding of the seal.
    pub fn abi_encode(seal: Groth16Seal) -> Result<Vec<u8>> {
        let seal = Seal::try_from(seal)?;
        Ok(seal.abi_encode())
    }
}

impl TryFrom<Groth16Seal> for Seal {
    type Error = anyhow::Error;

    fn try_from(seal: Groth16Seal) -> Result<Self> {
        ensure!(
            seal.a.len() == 2,
            "seal.a has invalid length: {}",
            seal.a.len()
        );
        ensure!(
            seal.b.len() == 2,
            "seal.b has invalid length: {}",
            seal.b.len()
        );
        ensure!(
            seal.b[0].len() == 2,
            "seal.b[0] has invalid length: {}",
            seal.b[0].len()
        );
        ensure!(
            seal.b[1].len() == 2,
            "seal.b[0] has invalid length: {}",
            seal.b[1].len()
        );
        ensure!(
            seal.c.len() == 2,
            "seal.c has invalid length: {}",
            seal.c.len()
        );

        let a0 = U256::from_be_slice(seal.a[0].as_slice());
        let a1 = U256::from_be_slice(seal.a[1].as_slice());
        let b00 = U256::from_be_slice(seal.b[0][0].as_slice());
        let b01 = U256::from_be_slice(seal.b[0][1].as_slice());
        let b10 = U256::from_be_slice(seal.b[1][0].as_slice());
        let b11 = U256::from_be_slice(seal.b[1][1].as_slice());
        let c0 = U256::from_be_slice(seal.c[0].as_slice());
        let c1 = U256::from_be_slice(seal.c[1].as_slice());

        Ok(Seal {
            a: [a0, a1],
            b: [[b00, b01], [b10, b11]],
            c: [c0, c1],
        })
    }
}

impl BonsaiProver {
    /// Generates a snark proof as a triplet (`Vec<u8>`, `FixedBytes<32>`,
    /// `Vec<u8>) for the given elf and input.
    

    
    pub fn prove(elf: &[u8], input: &[u8]) -> Result<(Vec<u8>, FixedBytes<32>, Vec<u8>)> {
        
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


        let snark_session = client.create_snark(session.uuid)?;
        log::info!("Created snark session: {}", snark_session.uuid);
        let snark_receipt = loop {
            let res = snark_session.status(&client)?;
            match res.status.as_str() {
                "RUNNING" => {
                    log::info!("Current status: {} - continue polling...", res.status,);
                    std::thread::sleep(Duration::from_secs(30));
                    continue;
                }
                "SUCCEEDED" => {
                    break res.output.context("No snark generated :(")?;
                }
                _ => {
                    panic!(
                        "Workflow exited: {} err: {}",
                        res.status,
                        res.error_msg.unwrap_or_default()
                    );
                }
            }
        };

        let snark = snark_receipt.snark;
        log::debug!("Snark proof!: {snark:?}");

        let seal = Seal::abi_encode(snark).context("Read seal")?;
        let post_state_digest: FixedBytes<32> = snark_receipt
            .post_state_digest
            .as_slice()
            .try_into()
            .context("Read post_state_digest")?;
        let journal = snark_receipt.journal;

        Ok((seal, post_state_digest, journal))
            
        }
}

