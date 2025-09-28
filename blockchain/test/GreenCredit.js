const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GreenCredit Contract Tests", function () {
  let GreenCredit, greenCredit, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    GreenCredit = await ethers.getContractFactory("GreenCredit");
    greenCredit = await GreenCredit.deploy();
    await greenCredit.waitForDeployment();
  });

  it("Should mint credits to user1", async function () {
    await greenCredit.issueCredit(user1.address, 100);
    expect(await greenCredit.credits(user1.address)).to.equal(100);
  });

  it("Should transfer credits from user1 to user2", async function () {
    await greenCredit.issueCredit(user1.address, 100);
    await greenCredit.connect(user1).transferCredit(user2.address, 50);
    expect(await greenCredit.credits(user1.address)).to.equal(50);
    expect(await greenCredit.credits(user2.address)).to.equal(50);
  });

  it("Should allow user2 to sell credits for ETH", async function () {
    // Fund contract with ETH first
    await owner.sendTransaction({
      to: await greenCredit.getAddress(),
      value: ethers.parseEther("1"),
    });

    await greenCredit.issueCredit(user2.address, 50);
    await greenCredit.connect(user2).sellCredits(20);
    expect(await greenCredit.credits(user2.address)).to.equal(30);
  });

  it("Should retire credits so they cannot be traded later", async function () {
    await greenCredit.issueCredit(user1.address, 100);
    await greenCredit.connect(user1).retireCredits(40);

    expect(await greenCredit.credits(user1.address)).to.equal(60);

    // user1 tries to transfer retired credits (should fail)
    await expect(
      greenCredit.connect(user1).transferCredit(user2.address, 70)
    ).to.be.revertedWith("Not enough credits");

    // user1 tries to sell retired credits (should fail)
    await expect(
      greenCredit.connect(user1).sellCredits(70)
    ).to.be.revertedWith("Not enough credits");
  });
});
