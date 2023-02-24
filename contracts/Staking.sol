// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IERC20.sol";
import "./IERC721.sol";

contract Staking {

    address platformToken;
    address boardApeNFT;

    struct StakedData {
        uint stakedAmount,
        uint stakedTime,
    }

    mapping (address => StakedData) stakes;

    address public admin;

    constructor(address _platformToken, address _boardApeNFT) {
        admin = msg.sender;
        boardApeNFT = _boardApeNFT;
        platformToken = _platformToken;
    }
}