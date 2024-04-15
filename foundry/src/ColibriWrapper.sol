// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./verifier/RiscZeroGroth16Verifier.sol";

contract ColibriWrapper is ERC20{

     RiscZeroGroth16Verifier verifier;

     constructor(
          //
     )ERC20("OMNI WRAPPED ETHER", "oWETH") {
          verifier = new RiscZeroGroth16Verifier();
     }


     // this token is meant to be used horizontally between networks, not vertically in the erc sense
     function transferFrom(address from, address to, uint256 value) public override returns (bool) {
          revert();
     }

     function transfer(address to, uint256 value) public override returns (bool) {
          revert();
     }

     function _wrapNativeEther(uint amount) internal{
          _mint(msg.sender, amount);
     }

     function _unwrapNativeEther(uint amount) internal{
          _burn(msg.sender, amount);
          (bool success, ) = msg.sender.call{value: amount}("");
          require(success, "Failed to send ether");
     }

     function mintWithRiscZeroProof(bytes calldata seal, bytes32 imageId, bytes32 postStateDigest, bytes memory journal) public {
          require(verifier.verify(seal, imageId, postStateDigest, sha256(journal)), "Invalid proof");
          //Output(journalDigest, bytes32(0)).digest();
          
          _wrapNativeEther(1);
     }


   receive() external payable {}


}
