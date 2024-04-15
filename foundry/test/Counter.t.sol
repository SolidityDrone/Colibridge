// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/ColibriWrapper.sol";

contract CounterTest is Test {
    ColibriWrapper colibri;
    function setUp() public {
        colibri = new ColibriWrapper();
    }
    function test_VerificationHardcode() public {
        colibri.mintWithRiscZeroProof(
            hex"0c1f612bae08e9faa90cb9c0fa2fc570d64878fe909711f8964d405c803375b3294382418fcc2ee1ce30cb6c2b12e745fe933770eff76840a8fc1937b2b658b80a8ac89c366857586ef68ce5b82fddde0b1e96aaac1feabcc6b96a80a104061d12a101d70b042c0c8eab8e43c426f900ca9eef17c2d04d3811eb64fb078140d102b8787da9cd5e307e0dc32c2a7d059a45e849b107daf480f1579786fedb3984085eaf2b3f24749c09303c0e0e038aa85bcc7c1ea57f6d707bdd01fc040ea31b14d7269336962bc910c207c2955f593b5afb832d22c413d619e4a1ee823db76c2f8df9b7a2d1e0cd7ddd386f54ef3f34bff13449e1e6d56fd974b9580dbccee6",
            0x783b58a0784b0e2a61e8d0d4a85071d6d870f99a9ab898c27f7f77edd29c02d7,
            0x1afe7240f341e5eed5358583d9aedaf86ce3009ef0bb64661bfa1bc30e1e6e21,
            hex""
        );
    }

    function test_wrap() public{

    }

    function test_unwrap() public{

    }

    function test_mintWithRiscZeroProof() public{
        
    }
}
