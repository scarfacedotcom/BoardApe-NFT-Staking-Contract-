// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
interface IERC721 {

     /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);
    function symbol() external returns (string memory);
}