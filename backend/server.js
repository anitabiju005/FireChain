const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Twilio setup (optional)
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Blockchain setup
const provider = new ethers.providers.JsonRpcProvider(
  process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com"
);

// Contract ABIs (simplified for demo)
const FIRE_INCIDENT_LOGGER_ABI = [
  "function reportIncident(string memory location, string memory description, int256 latitude, int256 longitude, uint8 severity) external returns (uint256)",
  "function getIncident(uint256 incidentId) external view returns (tuple(uint256 id, string location, string description, int256 latitude, int256 longitude, uint256 timestamp, address reporter, uint8 severity, uint8 status, address verifier, uint256 verificationTimestamp, bool rewardClaimed))",
  "function getTotalIncidents() external view returns (uint256)",
  "function verifyIncident(uint256 incidentId, uint8 status) external",
  "event IncidentReported(uint256 indexed incidentId, address indexed reporter, string location, uint8 severity, uint256 timestamp)"
];

const FIRECHAIN_TOKEN_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)"
];

// Contract instances
let fireIncidentLogger, fireChainToken;

if (process.env.FIRE_INCIDENT_LOGGER_ADDRESS && process.env.FIRECHAIN_TOKEN_ADDRESS) {
  fireIncidentLogger = new ethers.Contract(
    process.env.FIRE_INCIDENT_LOGGER_ADDRESS,
    FIRE_INCIDENT_LOGGER_ABI,
    provider
  );
  
  fireChainToken = new ethers.Contract(
    process.env.FIRECHAIN_TOKEN_ADDRESS,
    FIRECHAIN_TOKEN_ABI,
    provider
  );
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    contracts: {
      fireIncidentLogger: !!fireIncidentLogger,
      fireChainToken: !!fireChainToken
    }
  });
});

// Get all incidents
app.get('/api/incidents', async (req, res) => {
  try {
    if (!fireIncidentLogger) {
      return res.status(500).json({ error: 'Contract not initialized' });
    }

    const totalIncidents = await fireIncidentLogger.getTotalIncidents();
    const incidents = [];

    for (let i = 1; i <= totalIncidents.toNumber(); i++) {
      try {
        const incident = await fireIncidentLogger.getIncident(i);
        incidents.push({
          id: incident.id.toNumber(),
          location: incident.location,
          description: incident.description,
          latitude: incident.latitude.toNumber() / 1e6,
          longitude: incident.longitude.toNumber() / 1e6,
          timestamp: incident.timestamp.toNumber(),
          reporter: incident.reporter,
          severity: incident.severity,
          status: incident.status,
          verifier: incident.verifier,
          verificationTimestamp: incident.verificationTimestamp.toNumber(),
          rewardClaimed: incident.rewardClaimed
        });
      } catch (error) {
        console.error(`Error fetching incident ${i}:`, error.message);
      }
    }

    res.json({ incidents, total: totalIncidents.toNumber() });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// Get specific incident
app.get('/api/incidents/:id', async (req, res) => {
  try {
    if (!fireIncidentLogger) {
      return res.status(500).json({ error: 'Contract not initialized' });
    }

    const incidentId = parseInt(req.params.id);
    const incident = await fireIncidentLogger.getIncident(incidentId);
    
    res.json({
      id: incident.id.toNumber(),
      location: incident.location,
      description: incident.description,
      latitude: incident.latitude.toNumber() / 1e6,
      longitude: incident.longitude.toNumber() / 1e6,
      timestamp: incident.timestamp.toNumber(),
      reporter: incident.reporter,
      severity: incident.severity,
      status: incident.status,
      verifier: incident.verifier,
      verificationTimestamp: incident.verificationTimestamp.toNumber(),
      rewardClaimed: incident.rewardClaimed
    });
  } catch (error) {
    console.error('Error fetching incident:', error);
    res.status(500).json({ error: 'Failed to fetch incident' });
  }
});

// Get user token balance
app.get('/api/balance/:address', async (req, res) => {
  try {
    if (!fireChainToken) {
      return res.status(500).json({ error: 'Token contract not initialized' });
    }

    const address = req.params.address;
    const balance = await fireChainToken.balanceOf(address);
    const decimals = await fireChainToken.decimals();
    
    res.json({
      address,
      balance: ethers.utils.formatUnits(balance, decimals),
      balanceWei: balance.toString()
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Send SMS notification (if Twilio is configured)
app.post('/api/notify', async (req, res) => {
  try {
    const { phoneNumber, message, incidentId } = req.body;
    
    if (!twilioClient) {
      return res.status(501).json({ error: 'SMS service not configured' });
    }

    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }

    const smsMessage = await twilioClient.messages.create({
      body: `🔥 FireChain Alert: ${message}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    res.json({
      success: true,
      messageSid: smsMessage.sid,
      incidentId
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS notification' });
  }
});

// Webhook for contract events (optional)
app.post('/api/webhook/incident', (req, res) => {
  try {
    const { incidentId, reporter, location, severity } = req.body;
    
    console.log('📡 New incident webhook received:', {
      incidentId,
      reporter,
      location,
      severity
    });

    // Here you could trigger additional actions like:
    // - Send notifications to nearby users
    // - Alert emergency services
    // - Update external systems
    
    res.json({ success: true, processed: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Contract interaction endpoints
app.post('/api/incidents/report', async (req, res) => {
  try {
    const { location, description, latitude, longitude, severity, privateKey } = req.body;
    
    if (!fireIncidentLogger || !privateKey) {
      return res.status(500).json({ error: 'Contract not initialized or private key missing' });
    }

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = fireIncidentLogger.connect(wallet);
    
    const lat = Math.floor(latitude * 1e6);
    const lng = Math.floor(longitude * 1e6);
    
    const tx = await contract.reportIncident(location, description, lat, lng, severity);
    const receipt = await tx.wait();
    
    res.json({
      success: true,
      transactionHash: receipt.transactionHash,
      incidentId: receipt.events?.[0]?.args?.incidentId?.toNumber()
    });
  } catch (error) {
    console.error('Error reporting incident:', error);
    res.status(500).json({ error: 'Failed to report incident' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FireChain Backend API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  
  if (fireIncidentLogger) {
    console.log('✅ Smart contracts initialized');
  } else {
    console.log('⚠️  Smart contracts not initialized - set contract addresses in .env');
  }
  
  if (twilioClient) {
    console.log('📱 SMS notifications enabled');
  } else {
    console.log('📱 SMS notifications disabled - configure Twilio in .env to enable');
  }
});

module.exports = app;