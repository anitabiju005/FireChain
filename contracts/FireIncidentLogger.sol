// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./FireChainToken.sol";

/**
 * @title FireIncidentLogger
 * @dev Smart contract for logging and managing fire incidents
 */
contract FireIncidentLogger {
    FireChainToken public immutable fireChainToken;
    
    enum IncidentStatus { Reported, Verified, Resolved, False }
    enum SeverityLevel { Low, Medium, High, Critical }
    
    struct FireIncident {
        uint256 id;
        string location;
        string description;
        int256 latitude;
        int256 longitude;
        uint256 timestamp;
        address reporter;
        SeverityLevel severity;
        IncidentStatus status;
        address verifier;
        uint256 verificationTimestamp;
        bool rewardClaimed;
    }
    
    uint256 private _incidentCounter;
    mapping(uint256 => FireIncident) public incidents;
    mapping(address => uint256[]) public reporterIncidents;
    mapping(address => uint256) public reporterCount;
    
    // Emergency fund tracking
    uint256 public totalEmergencyFund;
    mapping(uint256 => uint256) public incidentFundAllocation;
    
    event IncidentReported(
        uint256 indexed incidentId,
        address indexed reporter,
        string location,
        SeverityLevel severity,
        uint256 timestamp
    );
    
    event IncidentVerified(
        uint256 indexed incidentId,
        address indexed verifier,
        IncidentStatus status,
        uint256 timestamp
    );
    
    event EmergencyFundReleased(
        uint256 indexed incidentId,
        uint256 amount,
        string location
    );
    
    event RewardClaimed(
        uint256 indexed incidentId,
        address indexed reporter,
        uint256 amount
    );
    
    constructor(address _tokenAddress) {
        fireChainToken = FireChainToken(_tokenAddress);
    }
    
    modifier validIncident(uint256 incidentId) {
        require(incidentId > 0 && incidentId <= _incidentCounter, "Invalid incident ID");
        _;
    }
    
    function reportIncident(
        string memory location,
        string memory description,
        int256 latitude,
        int256 longitude,
        SeverityLevel severity
    ) external returns (uint256) {
        _incidentCounter++;
        uint256 incidentId = _incidentCounter;
        
        incidents[incidentId] = FireIncident({
            id: incidentId,
            location: location,
            description: description,
            latitude: latitude,
            longitude: longitude,
            timestamp: block.timestamp,
            reporter: msg.sender,
            severity: severity,
            status: IncidentStatus.Reported,
            verifier: address(0),
            verificationTimestamp: 0,
            rewardClaimed: false
        });
        
        reporterIncidents[msg.sender].push(incidentId);
        reporterCount[msg.sender]++;
        
        // Auto-allocate emergency fund based on severity
        uint256 fundAmount = _calculateEmergencyFund(severity);
        if (fundAmount > 0) {
            incidentFundAllocation[incidentId] = fundAmount;
            totalEmergencyFund += fundAmount;
            emit EmergencyFundReleased(incidentId, fundAmount, location);
        }
        
        emit IncidentReported(incidentId, msg.sender, location, severity, block.timestamp);
        
        return incidentId;
    }
    
    function verifyIncident(uint256 incidentId, IncidentStatus status) 
        external 
        validIncident(incidentId) 
    {
        require(status != IncidentStatus.Reported, "Cannot set status to Reported");
        require(incidents[incidentId].status == IncidentStatus.Reported, "Incident already verified");
        
        incidents[incidentId].status = status;
        incidents[incidentId].verifier = msg.sender;
        incidents[incidentId].verificationTimestamp = block.timestamp;
        
        // Mint verification reward
        fireChainToken.mintVerificationReward(msg.sender);
        
        // Mint report reward if verified as true
        if (status == IncidentStatus.Verified && !incidents[incidentId].rewardClaimed) {
            fireChainToken.mintReportReward(incidents[incidentId].reporter);
            incidents[incidentId].rewardClaimed = true;
            
            emit RewardClaimed(
                incidentId, 
                incidents[incidentId].reporter, 
                fireChainToken.REPORT_REWARD()
            );
        }
        
        emit IncidentVerified(incidentId, msg.sender, status, block.timestamp);
    }
    
    function _calculateEmergencyFund(SeverityLevel severity) private pure returns (uint256) {
        if (severity == SeverityLevel.Critical) return 1000 ether; // Mock amount
        if (severity == SeverityLevel.High) return 500 ether;
        if (severity == SeverityLevel.Medium) return 200 ether;
        return 50 ether; // Low severity
    }
    
    function getIncident(uint256 incidentId) 
        external 
        view 
        validIncident(incidentId) 
        returns (FireIncident memory) 
    {
        return incidents[incidentId];
    }
    
    function getReporterIncidents(address reporter) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return reporterIncidents[reporter];
    }
    
    function getTotalIncidents() external view returns (uint256) {
        return _incidentCounter;
    }
    
    function getIncidentsByStatus(IncidentStatus status) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256[] memory result = new uint256[](_incidentCounter);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= _incidentCounter; i++) {
            if (incidents[i].status == status) {
                result[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory finalResult = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }
        
        return finalResult;
    }
}