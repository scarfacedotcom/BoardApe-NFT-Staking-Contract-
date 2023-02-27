import { ethers } from "hardhat";
const hre = require("hardhat");
import { impersonateAccount } from "@nomicfoundation/hardhat-network-helpers";
import { Signer, BigNumber } from "ethers"

async function main() {
  
  const BoardApeStaking = await ethers.getContractFactory("BoardApeStaking");
  const boardApeStaking = await BoardApeStaking.deploy("0xD2D5e508C82EFc205cAFA4Ad969a4395Babce026", "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");

  await boardApeStaking.deployed();

  console.log(`BoardApeStaking COntract has been deplyed to ${boardApeStaking.address}`);//Contract has been deplyed to 0xD2D5e508C82EFc205cAFA4Ad969a4395Babce026

  const stakingAdmin = await boardApeStaking.admin()
  console.log(`Staking Admin ${stakingAdmin}`); // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

//   BoardApeStaking COntract has been deplyed to 0xD2D5e508C82EFc205cAFA4Ad969a4395Babce026
//   Staking Admin 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
