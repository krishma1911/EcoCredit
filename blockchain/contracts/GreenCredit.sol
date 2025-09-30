// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GreenCredit {
    mapping(address => uint256) public credits;
    mapping(address => uint256) public retiredCredits;
    mapping(string => bool) public existingProjects;

    address public owner;

    event CreditIssued(address indexed to, uint256 amount, string projectId, uint256 validationScore);
    event CreditTransferred(address indexed from, address indexed to, uint256 amount);
    event CreditBought(address indexed buyer, uint256 amount);
    event CreditSold(address indexed seller, uint256 amount);
    event CreditRetired(address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // -------------------------------
    // Mint random project with validation
    // -------------------------------
   function mintRandomProject(uint256 amount) external returns (bool) {
    require(amount > 0, "Amount must be > 0");

    // Random projectId 1-5
    uint256 randId = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 5 + 1;
    string memory projectId = string(abi.encodePacked("PROJECT-", uint2str(randId)));
    require(!existingProjects[projectId], "Project already exists");

    // Generate validationScore between 70-100 (always pass for demo)
    uint256 validationScore = 70 + (uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender))) % 31);

    // Mint credits
    existingProjects[projectId] = true;
    credits[msg.sender] += amount;

    emit CreditIssued(msg.sender, amount, projectId, validationScore);
    return true;
}

    // -------------------------------
    // Transfer credits between users
    // -------------------------------
    function transferCredit(address to, uint256 amount) public {
        require(credits[msg.sender] >= amount, "Not enough credits");
        credits[msg.sender] -= amount;
        credits[to] += amount;
        emit CreditTransferred(msg.sender, to, amount);
    }

    // -------------------------------
    // Buy credits with ETH
    // -------------------------------
    function buyCredits(uint256 amount) public payable {
        require(msg.value >= amount * 1e15, "Not enough ETH sent"); // 0.001 ETH per credit
        credits[msg.sender] += amount;
        emit CreditBought(msg.sender, amount);
    }

    // -------------------------------
    // Sell credits back for ETH
    // -------------------------------
    function sellCredits(uint256 amount) public {
        require(credits[msg.sender] >= amount, "Not enough credits");
        credits[msg.sender] -= amount;
        payable(msg.sender).transfer(amount * 1e15);
        emit CreditSold(msg.sender, amount);
    }

    // -------------------------------
    // Retire credits
    // -------------------------------
    function retireCredits(uint256 amount) public {
        require(credits[msg.sender] >= amount, "Not enough credits to retire");
        credits[msg.sender] -= amount;
        retiredCredits[msg.sender] += amount;
        emit CreditRetired(msg.sender, amount);
    }

    // -------------------------------
    // Utilities
    // -------------------------------
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) return "0";
        uint j = _i;
        uint len;
        while (j != 0) { len++; j /= 10; }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = uint8(48 + _i % 10);
            bstr[k] = bytes1(temp);
            _i /= 10;
        }
        return string(bstr);
    }

    // Allow contract to receive ETH directly
    receive() external payable {}
    fallback() external payable {}
}
