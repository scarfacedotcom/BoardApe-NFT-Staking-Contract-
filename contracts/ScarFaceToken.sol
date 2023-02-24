// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ScarFaceToken is ERC20, Ownable {

    address public admin;
    uint256 public Max_Supply = 100 * 10 **18;
    constructor() ERC20("ScarFaceToken", "SFT") {
            admin = msg.sender;
            _mint(address(this), Max_Supply);
            _mint(admin, 100 * 10 ** 18);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}