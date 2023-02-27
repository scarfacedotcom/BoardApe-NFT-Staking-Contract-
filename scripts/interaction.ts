import { ethers } from "hardhat";
const hre = require("hardhat");
import { impersonateAccount } from "@nomicfoundation/hardhat-network-helpers";
import { Signer, BigNumber } from "ethers"

async function main() {
//BoardApeStaking COntract has been deplyed to 0xD2D5e508C82EFc205cAFA4Ad969a4395Babce026
//Staking Admin 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

const coinAddress = "0xD2D5e508C82EFc205cAFA4Ad969a4395Babce026";

const stakeContractAddress = "0xD2D5e508C82EFc205cAFA4Ad969a4395Babce026";

const stakeCoin = await ethers.getContractAt("ScarFaceToken", "coinAddress");

const stakeContract = await ethers.getContractAt("BoardApeStaking", "stakeContractAddress");

  //impersonate BoardApe Holders Account
  const boredApeNFTHolder = "0x758c32B770d656248BA3cC222951cF1aC1DdDAaA";

  const helpers = require("@nomicfoundation/hardhat-network-helpers");
  await helpers.impersonateAccount(boredApeNFTHolder);
  const impersonatedSigner = await ethers.getSigner(boredApeNFTHolder);
  const amt = ethers.utils.parseUnits("1");
  console.log(`Impersonated Signers Address is ${impersonatedSigner.address}`);

  // Approve contract to spend and stake platform token
  console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~APPROVE CONTRACT TO SPEND AND STAKE TOKEN~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
  await stakeCoin.connect(impersonatedSigner).approve(stakeContractAddress, amt);

  const stakeAmt = ethers.utils.parseUnits("1");

  const stakeTnx = await stakeContract.connect(impersonatedSigner).stake(stakeAmt);
  const stakeRecpt = await stakeTnx.wait();
  console.log(`staking transaction is ${stakeRecpt}`);

  console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~GETTING THE  BALANCE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
  const contractBlance = await stakeCoin.balanceOf(stakeContractAddress);
  console.log(`The balance is ${contractBlance}`);

  console.log(`~~~~~~~~~~~~~~~~~~~~~~~TRANSACTION 2~~~~~~~~~~~~~~~~WITHDRAW TRANSACTION~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);

  const transferToken = await stakeCoin.transfer(stakeContractAddress, amt);
  const tfWaited = await transferToken.wait();
  console.log(`Transfer Reciept: ${tfWaited}`);

  const impersonatedBlance = await stakeCoin.balanceOf(impersonatedSigner.address);
  console.log(`Impersonated Balance is ${impersonatedBlance}`);

  const withdrawTnx = await stakeContract.connect(impersonatedSigner).calculateWithdrawalAmount();
  //const withdrawReceipt = await withdrawTnx.wait();
  console.log(`Withdrawal transaction; ${withdrawTnx}`);

  const impersonatedBalanceAfter = await stakeCoin.balanceOf(impersonatedSigner.address);
  console.log(`Impersonated token balance After: ${impersonatedBalanceAfter}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
