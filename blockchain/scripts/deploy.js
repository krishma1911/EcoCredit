const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("🚀 Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer balance before deploy:", hre.ethers.formatEther(balance), "ETH");

  // Deploy contract
  const GreenCredit = await hre.ethers.getContractFactory("GreenCredit");
  const greenCredit = await GreenCredit.deploy();
  await greenCredit.waitForDeployment();

  const contractAddress = await greenCredit.getAddress();
  console.log("✅ GreenCredit deployed to:", contractAddress);

  // Fund contract with 10 ETH for buybacks
  const tx = await deployer.sendTransaction({
    to: contractAddress,
    value: hre.ethers.parseEther("10")
  });
  await tx.wait();
  console.log("💸 Contract funded with 10 ETH for buybacks");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
