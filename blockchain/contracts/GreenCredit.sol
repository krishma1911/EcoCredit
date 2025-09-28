// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GreenCredit {
    mapping(address => uint256) public credits;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Issue credits
    function issueCredit(address to, uint256 amount) public {
        require(msg.sender == owner, "Only owner can issue credits");
        credits[to] += amount;
    }

    // Transfer credits between users
    function transferCredit(address to, uint256 amount) public {
        require(credits[msg.sender] >= amount, "Not enough credits");
        credits[msg.sender] -= amount;
        credits[to] += amount;
    }

    // Buy credits with ETH
    function buyCredits(uint256 amount) public payable {
        require(msg.value >= amount * 1e15, "Not enough ETH sent"); // 0.001 ETH per credit
        credits[msg.sender] += amount;
    }

    // Sell credits back for ETH
    function sellCredits(uint256 amount) public {
        require(credits[msg.sender] >= amount, "Not enough credits");
        credits[msg.sender] -= amount;
        payable(msg.sender).transfer(amount * 1e15);
    }

function retireCredits(uint256 amount) public {
    require(credits[msg.sender] >= amount, "Not enough credits");
    credits[msg.sender] -= amount;
    // maybe emit an event Retired(msg.sender, amount);
}

    // ✅ New: allow contract to receive ETH directly
    receive() external payable {}
    fallback() external payable {}
}
