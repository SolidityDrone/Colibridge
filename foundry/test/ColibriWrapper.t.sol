// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/ColibriWrapper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract CounterTest is Test {
    ColibriWrapper colibri;
    function setUp() public {
        colibri = new ColibriWrapper();
    }
    function test_VerificationHardcode() public {
        colibri.mintWithRiscZeroProof(
            hex"20bfe7d1342776674f726100ab5f8621495e5e057e2118ef27b6967f3c2f6e9d279c4a7370fb1f96d8d6dcb016c595d1615db90d8f27712decba1fd85b7258e207b6ee76f221123487bf1eaa5aff2fc4e0972803f1ffe8a044b625e10dcae13a05e73a6754fdb1eaa94c5a1a14b5b7cc5b9853403a003fb63145c9ec4d1fdabc08e337f7705c2ecf664dd47d62a409f3cf33b45ff271ee47b1e48497f16e43d00300a7afa675bcc6ca4ebdcb30f883953927e59083c4a62921acf7d5124ff05f2f5dda992c886197c73e23f3b071235cbcdfc8b11766399a42509211e385cacd1358265fe9f71d675fd09f1de65ca2ee7cb3d6241694fb596242680f774f9a4c",
            0x7d9c1ec61ad9b35399c9cd6529656ed55c6abd2a8209aa18618ee847d1edd91e,
            0x7d9c1ec61ad9b35399c9cd6529656ed55c6abd2a8209aa18618ee847d1edd91e,
            hex"000000000000000000000000000000000000000000000000000000000000249e0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f08a50178dfcde18524640ea6618a1f965821715"
        );
    }

    function test_wrap() public{
        vm.deal(address(this), 1e18);
        colibri.wrapNativeEther{value: 1e18}();
        assertTrue(IERC20(address(colibri)).balanceOf(address(this)) == 1e18);
    }

    function test_unwrap() public{
        vm.deal(address(this), 1e18);
        uint startbal = address(colibri).balance;
        colibri.wrapNativeEther{value: 1e18}();
        assertTrue(IERC20(address(colibri)).balanceOf(address(this)) == 1e18);

        colibri.unwrapNativeEther(1e18);
        assertTrue(IERC20(address(colibri)).balanceOf(address(this)) == 0);
        assertTrue(address(colibri).balance == startbal);
    }

 
    receive() external payable {}
}
