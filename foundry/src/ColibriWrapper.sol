// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./verifier/RiscZeroGroth16Verifier.sol";

/**
 * @title ColibriWrapper
 * @dev A contract that wraps native Ether into an ERC20 token.
 */
contract ColibriWrapper is ERC20{

     RiscZeroGroth16Verifier verifier;
     
     mapping(address =>mapping(uint =>bool)) public usedNonces;

     constructor(
          //
     )ERC20("oWETH", "oWETH") {
          verifier = new RiscZeroGroth16Verifier();
     }

     /**
      * @dev Wraps native Ether into the ERC20 token.
      */
     function wrapNativeEther() public payable{
          _mint(msg.sender, msg.value);
     }

     /**
      * @dev Unwraps the ERC20 token into native Ether.
      * @param amount The amount of tokens to unwrap.
      */
     function unwrapNativeEther(uint amount) public{
          _burn(msg.sender, amount);
          (bool success, ) = msg.sender.call{value: amount}("");
          require(success, "Failed to send ether");
     }

     /**
      * @dev Gets the current chain ID.
      * @return The chain ID.
      */
     function getChainID() public view returns (uint256) {
          uint256 chainId;
          assembly {
               chainId := chainid()
          }
          return chainId;
     }

     /**
      * @dev Mints tokens based on a RiscZero proof.
      * @param seal The proof seal.
      * @param imageId The image ID.
      * @param postStateDigest The post-state digest.
      * @param journal The journal data.
      */
     function mintWithRiscZeroProof(bytes calldata seal, bytes32 imageId, bytes32 postStateDigest, bytes memory journal) public {
          require(verifier.verify(seal, imageId, postStateDigest, sha256(journal)), "Invalid proof");
          (uint journalAmount, uint journalToChainId, uint nonce, address account) = abi.decode(journal, (uint, uint, uint, address));
          require(account == msg.sender, "Invalid account");
          require(!usedNonces[msg.sender][journalAmount], "Nonce already used");
          require (journalToChainId == getChainID(), "Invalid chain id");
          usedNonces[msg.sender][journalAmount] = true;          
          _mint(msg.sender, journalAmount);
     }

     /**
      * @dev Overrides the transferFrom function to prevent transfers.
      */
     function transferFrom(address from, address to, uint256 value) public override returns (bool) {
          revert();
     }

     /**
      * @dev Overrides the transfer function to prevent transfers.
      */
     function transfer(address to, uint256 value) public override returns (bool) {
          revert();
     }

     receive() external payable {}
}
