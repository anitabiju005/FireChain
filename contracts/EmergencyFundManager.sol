// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./FireIncidentLogger.sol";
import "./FireChainToken.sol";

/**
 * @title EmergencyFundManager
 * @dev Manages emergency fund disbursement for fire incidents
 */
contract EmergencyFundManager {
    FireIncidentLogger public immutable incidentLogger;
    FireChainToken public immutable fireChainToken;
    
    struct FundRequest {
        uint256 incidentId;
        uint256 requestedAmount;
        address requester;
        string justification;
        uint256 timestamp;
        bool approved;
        bool disbursed;
    }
    
    mapping(uint256 => FundRequest) public fundRequests;
    mapping(address => bool) public authorizedApprovers;
    uint256 private _requestCounter;
    uint256 public totalFundsAvailable;
    uint256 public totalFundsDisbursed;
    
    event FundRequested(
        uint256 indexed requestId,
        uint256 indexed incidentId,
        address indexed requester,
        uint256 amount
    );
    
    event FundApproved(
        uint256 indexed requestId,
        address indexed approver,
        uint256 amount
    );
    
    event FundDisbursed(
        uint256 indexed requestId,
        address indexed recipient,
        uint256 amount
    );
    
    event FundsDeposited(uint256 amount);
    
    modifier onlyApprover() {
        require(authorizedApprovers[msg.sender], "Not authorized to approve funds");
        _;
    }
    
    constructor(address _incidentLogger, address _tokenAddress) {
        incidentLogger = FireIncidentLogger(_incidentLogger);
        fireChainToken = FireChainToken(_tokenAddress);
        authorizedApprovers[msg.sender] = true;
        totalFundsAvailable = 10000 ether; // Initial mock fund
    }
    
    function requestFunds(
        uint256 incidentId,
        uint256 requestedAmount,
        string memory justification
    ) external returns (uint256) {
        // Verify incident exists and is verified
        FireIncidentLogger.FireIncident memory incident = incidentLogger.getIncident(incidentId);
        require(
            incident.status == FireIncidentLogger.IncidentStatus.Verified,
            "Incident must be verified"
        );
        
        _requestCounter++;
        uint256 requestId = _requestCounter;
        
        fundRequests[requestId] = FundRequest({
            incidentId: incidentId,
            requestedAmount: requestedAmount,
            requester: msg.sender,
            justification: justification,
            timestamp: block.timestamp,
            approved: false,
            disbursed: false
        });
        
        emit FundRequested(requestId, incidentId, msg.sender, requestedAmount);
        return requestId;
    }
    
    function approveFundRequest(uint256 requestId) external onlyApprover {
        FundRequest storage request = fundRequests[requestId];
        require(request.requestedAmount > 0, "Invalid request");
        require(!request.approved, "Already approved");
        require(request.requestedAmount <= totalFundsAvailable, "Insufficient funds");
        
        request.approved = true;
        emit FundApproved(requestId, msg.sender, request.requestedAmount);
    }
    
    function disburseFunds(uint256 requestId) external {
        FundRequest storage request = fundRequests[requestId];
        require(request.approved, "Request not approved");
        require(!request.disbursed, "Already disbursed");
        require(request.requestedAmount <= totalFundsAvailable, "Insufficient funds");
        
        request.disbursed = true;
        totalFundsAvailable -= request.requestedAmount;
        totalFundsDisbursed += request.requestedAmount;
        
        // In a real implementation, this would transfer actual funds
        // For demo purposes, we'll mint tokens as a representation
        fireChainToken.mintReward(
            request.requester,
            request.requestedAmount,
            "Emergency fund disbursement"
        );
        
        emit FundDisbursed(requestId, request.requester, request.requestedAmount);
    }
    
    function depositFunds() external payable {
        totalFundsAvailable += msg.value;
        emit FundsDeposited(msg.value);
    }
    
    function addApprover(address approver) external onlyApprover {
        authorizedApprovers[approver] = true;
    }
    
    function removeApprover(address approver) external onlyApprover {
        authorizedApprovers[approver] = false;
    }
    
    function getFundRequest(uint256 requestId) external view returns (FundRequest memory) {
        return fundRequests[requestId];
    }
}