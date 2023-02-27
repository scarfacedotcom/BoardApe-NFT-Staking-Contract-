import { ethers } from "hardhat";
const hre = require("hardhat");
import { impersonateAccount } from "@nomicfoundation/hardhat-network-helpers";
import { Signer, BigNumber } from "ethers"

async function main() {
  
  const ScarFaceToken = await ethers.getContractFactory("ScarFaceToken");
  const token = await ScarFaceToken.deploy();

  await token.deployed();

  console.log(`Token has been deplyed to ${token.address}`);//Token has been deplyed to 0xD2D5e508C82EFc205cAFA4Ad969a4395Babce026

  const tokenOwner = await token.admin();
  console.log(`Token Owner is ${tokenOwner}`); //Token Owner is 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

  const ownerBalance = await token.balanceOf(tokenOwner);
  console.log(`Owner balance is ${ownerBalance}`);//Owner balance is 100000000000000000000

  //impersonate BoardApe Holders Accoumt
  const boredApeNFTHolder = "0x758c32B770d656248BA3cC222951cF1aC1DdDAaA";

  const helpers = require("@nomicfoundation/hardhat-network-helpers");
  await helpers.impersonateAccount(boredApeNFTHolder);
  const impersonatedSigner = await ethers.getSigner(boredApeNFTHolder);
  const amt = ethers.utils.parseUnits("1000");
  console.log(`Impersonated Signers Address is ${impersonatedSigner.address}`);

  const transferToken = await token.transfer(impersonatedSigner.address, amt);
  const transferWaited = await transferToken.wait();
  console.log(`Mint Trabsaction ${transferWaited}`);

  const impersonatedSignerBal = await token.balanceOf(impersonatedSigner.address);
  console.log(`Signer Balance ${impersonatedSignerBal}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
