// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IERC20.sol";
import "./IERC721.sol";

contract Staking {

    address platformToken;
    address boardApeNFT;

    struct StakedData {
        uint stakedAmount;
        uint stakedTime;
    }

    mapping (address => StakedData) stakes;

    address public admin;

    constructor(address _platformToken, address _boardApeNFT) {
        admin = msg.sender;
        boardApeNFT = _boardApeNFT;
        platformToken = _platformToken;
    }

    function stake(uint256 _amount) external{
        require(_amount > 0, "Stake amount has to be greater than zero");
        require(IERC20(platformToken).balanceOf(msg.sender) >= _amount, "You are a broke ass");
        require(IERC721(boardApeNFT).balanceOf(msg.sender) > 0, "You dont have an NFT");

        IERC20(platformToken).transferFrom(msg.sender, address(this), _amount);

        StakedData storage sdata = stakes[msg.sender];
        sdata.stakedAmount = _amount;
        sdata.stakedTime = block.timestamp;
    }

    function withdraw()external{
        uint userStake = stakes[msg.sender].stakedAmount;
        require(userStake > 0, "you currently dont have any stake");
        require(IERC20(platformToken).balanceOf(address(this)) >= userStake, "NO funds");

        stakes[msg.sender].stakedAmount = 0;

        IERC20(platformToken).transfer(msg.sender, userStake);
    }

    function calWithdrawAmount() public{
        StakedData storage sData = stakes[msg.sender];
        uint balance = sData.stakedAmount;

        require(balance > 0, "you are broke");
        require(IERC20(platformToken).balanceOf(address(this)) >= balance, "no tokrns bro");

        uint totalTime = block.timestamp - sData.stakedTime;
        uint gain = ((balance / 25820000) * totalTime);
        uint withdrawal = gain + balance;

        sData.stakedAmount= 0;
        IERC20(platformToken).transfer(msg.sender, withdrawal);

    }
}