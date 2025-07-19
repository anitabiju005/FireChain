// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FireChainToken (FCT)
 * @dev ERC-20 token for rewarding fire incident reporters
 */
contract FireChainToken is ERC20, Ownable {
    uint256 public constant REPORT_REWARD = 10 * 10**18; // 10 FCT per report
    uint256 public constant VERIFICATION_REWARD = 5 * 10**18; // 5 FCT for verification
    
    mapping(address => bool) public authorizedMinters;
    
    event RewardMinted(address indexed recipient, uint256 amount, string reason);
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    
    constructor() ERC20("FireChain Token", "FCT") {
        _mint(msg.sender, 1000000 * 10**18); // Initial supply: 1M FCT
        authorizedMinters[msg.sender] = true;
    }
    
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        _;
    }
    
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }
    
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }
    
    function mintReward(address recipient, uint256 amount, string memory reason) external onlyMinter {
        _mint(recipient, amount);
        emit RewardMinted(recipient, amount, reason);
    }
    
    function mintReportReward(address reporter) external onlyMinter {
        _mint(reporter, REPORT_REWARD);
        emit RewardMinted(reporter, REPORT_REWARD, "Fire incident report");
    }
    
    function mintVerificationReward(address verifier) external onlyMinter {
        _mint(verifier, VERIFICATION_REWARD);
        emit RewardMinted(verifier, VERIFICATION_REWARD, "Report verification");
    }
}