// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IERC20.sol";
import "./IERC721.sol";

contract BoardApeStaking {

    address platformToken;
    address boardApeNFT;

    struct StakedData {
        uint stakedAmount;
        uint stakedTime;
        uint lastInterestCalculation;
        uint interestRate;
    }

    mapping (address => StakedData) public stakes;

    address public admin;
    
    uint constant ANNUAL_INTEREST_RATE = 10;
    constructor(address _platformToken, address _boardApeNFT) {
        admin = msg.sender;
        boardApeNFT = _boardApeNFT;
        platformToken = _platformToken;
    }

    function stake(uint256 _amount) external{
    require(_amount > 0, "Stake amount has to be greater than zero");
    require(IERC20(platformToken).balanceOf(msg.sender) >= _amount, "Insufficient balance");
    require(IERC721(boardApeNFT).balanceOf(msg.sender) > 0, "You must own a Board Ape NFT");

    IERC20(platformToken).transferFrom(msg.sender, address(this), _amount);

    StakedData storage stakedData = stakes[msg.sender];
    uint timeSinceLastCalculation = block.timestamp - stakedData.lastInterestCalculation;
    uint interest = calculateInterest(stakedData.stakedAmount, timeSinceLastCalculation);

    stakedData.stakedAmount += _amount + interest;
    stakedData.stakedTime = block.timestamp;
    stakedData.lastInterestCalculation = block.timestamp;
    stakedData.interestRate = ANNUAL_INTEREST_RATE;
}

function withdraw() external {
    StakedData storage stakedData = stakes[msg.sender];
    require(stakedData.stakedAmount > 0, "You currently do not have any stake");
    require(IERC20(platformToken).balanceOf(address(this)) >= stakedData.stakedAmount, "Insufficient funds");

    uint withdrawalAmount = calculateWithdrawalAmount();
    stakedData.stakedAmount = 0;
    IERC20(platformToken).transfer(msg.sender, withdrawalAmount);
}

    function calculateWithdrawalAmount() public view returns (uint) {
    StakedData storage stakedData = stakes[msg.sender];
    uint balance = stakedData.stakedAmount;

    require(balance > 0, "You are broke");
    require(IERC20(platformToken).balanceOf(address(this)) >= balance, "Insufficient funds");

    uint totalTime = block.timestamp - stakedData.stakedTime;
    uint interest = calculateInterest(balance, timeSinceLastCalculation);
    uint withdrawalAmount = balance + interest;

    return withdrawalAmount;
}

function calculateInterest (uint _amount, uint _time) public view returns (uint) {
    uint compoundingPeriods = _time / 1 days; 
    uint interestRate = ANNUAL_INTEREST_RATE;
    uint interest = _amount;

    for (uint i=0; i < compoundingPeriods; i++) {
        interest = (interest * (100 + interestRate)) / 100;
    }

    return interest - _amount;
}
}