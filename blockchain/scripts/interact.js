const hre = require("hardhat");

async function main() {
  const [owner, user1, user2] = await hre.ethers.getSigners();

  // 👇 Replace this with the deployed contract address from deploy.js logs
  const contractAddress = "0x245F653Ed57539Cd23A580DD06462E8492638b2e";

  // ✅ Get contract instance (without signer to avoid ENS resolution issue)
  const greenCredit = await hre.ethers.getContractAt("GreenCredit", contractAddress);

  console.log("✅ Connected to GreenCredit at:", contractAddress);

  // 1. Owner issues credits to user1
  let tx = await greenCredit.connect(owner).issueCredit(user1.address, 100);
  await tx.wait();
  console.log(`🌱 Issued 100 GreenCredits to: ${user1.address}`);

  // 2. Check user1 balance
  let balance1 = await greenCredit.credits(user1.address);
  console.log("📊 User1 balance:", balance1.toString());

  // 3. User1 transfers 50 credits → User2
  tx = await greenCredit.connect(user1).transferCredit(user2.address, 50);
  await tx.wait();
  console.log(`🔄 Transferred 50 GreenCredits from User1 → User2`);

  // 4. Check balances again
  balance1 = await greenCredit.credits(user1.address);
  let balance2 = await greenCredit.credits(user2.address);
  console.log("📊 User1 balance after transfer:", balance1.toString());
  console.log("📊 User2 balance after transfer:", balance2.toString());

  // 5. User2 sells 20 credits back for ETH
  tx = await greenCredit.connect(user2).sellCredits(20);
  await tx.wait();
  console.log("💸 User2 sold 20 credits back for ETH");

  // Final balances
  balance1 = await greenCredit.credits(user1.address);
  balance2 = await greenCredit.credits(user2.address);
  console.log("✅ Final Balances → User1:", balance1.toString(), "User2:", balance2.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
