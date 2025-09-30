require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const GANACHE_URL = process.env.GANACHE_URL || "";
const PRIVATE_KEY1 = process.env.PRIVATE_KEY1 || "";
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2 || "";
const PRIVATE_KEY3 = process.env.PRIVATE_KEY3 || "";

module.exports = {
  solidity: "0.8.24",
  networks: {
    ganache: {
      url: GANACHE_URL,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2, PRIVATE_KEY3].filter(Boolean), // remove undefined
    },
  }
};
