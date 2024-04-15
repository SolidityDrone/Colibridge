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
            hex"0a9df29a81c1d46c996a2ebe801a094c8fbf8ff7d7476a5e144ac55a262210290f6986d06aabf95c0018d3ab48a90ba34bad8778e87cc572fbf3b36fa137f1511e90f97bc01ffa741c10d0335e6df206b311d4fd6579468e27346212ddf1fe9e244e363057358cbbf0661ba42ea3459a69328e6520c93f5a158d52ac183e2b7028bd1dc04d0e470fdb450813e97fcc12f6534346cd854478ec0ba4640545f4312d935c66756c7ec519a087b68340de4c1c24de2e4b7b6441bee29592fcb689162e9a6c1d5c60c414b7046ba1b555bfe459de7d86b1fe367903b9314880432eb4223745de2a3758ecfc13c15561d6ca56728ea312694cfcc03fcd569ba9726e53",
            0x34ffbe0c65d140cf251b3c0892cd7a3d575ac4c0fbe1de6f058fd99d6f9ad9e0,
            0x1032f5f2b9256a9c1f2034406da68ec6c6e9cb6206e118b2a6153a05e02e66d2,
            hex"00000000000000000000000000000000000000000000000000000000000027100000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f08a50178dfcde18524640ea6618a1f965821715"
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
