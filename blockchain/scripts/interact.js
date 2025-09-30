const hre = require("hardhat");

async function main() {
  const [owner, user1, user2] = await hre.ethers.getSigners();

  // Replace this with deployed contract address
  const contractAddress = "0xYourDeployedContractAddressHere";

  const greenCredit = await hre.ethers.getContractAt("GreenCredit", contractAddress);
  console.log("✅ Connected to GreenCredit at:", contractAddress);

  // -------------------------------
  // 1. Mint random project for user1
  // -------------------------------
  let tx = await greenCredit.connect(user1).mintRandomProject(100);
  await tx.wait();
  console.log(`🌱 User1 minted 100 credits for a verified project`);

  // 2. Transfer 50 credits to User2
  tx = await greenCredit.connect(user1).transferCredit(user2.address, 50);
  await tx.wait();
  console.log("🔄 Transferred 50 credits from User1 → User2");

  // 3. User2 sells 20 credits for ETH
  tx = await greenCredit.connect(user2).sellCredits(20);
  await tx.wait();
  console.log("💸 User2 sold 20 credits for ETH");

  // 4. User1 retires 30 credits
  tx = await greenCredit.connect(user1).retireCredits(30);
  await tx.wait();
  console.log("♻️ User1 retired 30 credits");

  // -------------------------------
  // Final balances
  // -------------------------------
  let balance1 = await greenCredit.credits(user1.address);
  let retired1 = await greenCredit.retiredCredits(user1.address);
  let balance2 = await greenCredit.credits(user2.address);

  console.log(`📊 Final User1 balance: ${balance1.toString()}, retired: ${retired1.toString()}`);
  console.log(`📊 Final User2 balance: ${balance2.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
