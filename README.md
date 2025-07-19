"# FIRECHAIN" 

🔥 **FireChain** - Blockchain-based Fire Incident Reporting & Emergency Response System

## Overview

FireChain is a decentralized application (dApp) built on Polygon Mumbai testnet that enables community-driven fire incident reporting, verification, and emergency fund management. The system rewards users with FCT (FireChain Tokens) for valid reports and provides a transparent, immutable record of fire incidents.

## Features

### 🏗️ Smart Contracts
- **FireChainToken (FCT)**: ERC-20 reward token for incident reporters
- **FireIncidentLogger**: Core contract for logging and managing fire incidents
- **EmergencyFundManager**: Handles emergency fund requests and disbursements

### 🌐 Frontend Dashboard
- Modern, sleek UI with dark theme (Jet Black, Dark Mauve, Soft Gold palette)
- Real-time incident tracking and visualization
- Interactive map with fire incident markers
- Wallet integration (MetaMask)
- Responsive design for all devices

### 🔧 Backend Services
- Express.js API for blockchain interaction
- SMS notifications via Twilio (optional)
- Data simulation scripts for testing
- Webhook support for real-time updates

## Technology Stack

- **Blockchain**: Solidity, Hardhat, Polygon Mumbai
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, Ethers.js
- **Maps**: Leaflet.js
- **Notifications**: Twilio API
- **Deployment**: Vercel/Netlify (Frontend), Render/Railway (Backend)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

### 3. Compile Smart Contracts
```bash
npm run compile
```

### 4. Deploy Contracts (Mumbai Testnet)
```bash
npm run deploy
```

### 5. Start Development
```bash
# Frontend
npm run dev

# Backend (separate terminal)
npm run backend
```

### 6. Simulate Data (Optional)
```bash
npm run simulate
```

## Smart Contract Addresses

After deployment, update your `.env` file with the contract addresses:

```
VITE_FIRECHAIN_TOKEN_ADDRESS=0x...
VITE_FIRE_INCIDENT_LOGGER_ADDRESS=0x...
VITE_EMERGENCY_FUND_MANAGER_ADDRESS=0x...
```

## Usage

### For Users
1. **Connect Wallet**: Use MetaMask to connect to Mumbai testnet
2. **Report Incidents**: Submit fire reports with location and severity
3. **Earn Rewards**: Receive FCT tokens for verified reports
4. **Track Progress**: Monitor incident status and emergency responses

### For Verifiers
1. **Verify Reports**: Confirm or reject community reports
2. **Earn Verification Rewards**: Get FCT tokens for verification work
3. **Manage Emergency Funds**: Approve fund disbursements for verified incidents

## API Endpoints

### Core Endpoints
- `GET /api/health` - Service health check
- `GET /api/incidents` - Fetch all incidents
- `GET /api/incidents/:id` - Get specific incident
- `GET /api/balance/:address` - Get FCT token balance
- `POST /api/notify` - Send SMS notifications
- `POST /api/incidents/report` - Report incident via API

## Contract Functions

### FireIncidentLogger
```solidity
function reportIncident(string location, string description, int256 lat, int256 lng, uint8 severity)
function verifyIncident(uint256 incidentId, uint8 status)
function getIncident(uint256 incidentId)
```

### FireChainToken
```solidity
function mintReportReward(address reporter)
function mintVerificationReward(address verifier)
function balanceOf(address account)
```

### EmergencyFundManager
```solidity
function requestFunds(uint256 incidentId, uint256 amount, string justification)
function approveFundRequest(uint256 requestId)
function disburseFunds(uint256 requestId)
```

## Development Scripts

- `npm run dev` - Start frontend development server
- `npm run backend` - Start backend API server
- `npm run compile` - Compile smart contracts
- `npm run deploy` - Deploy contracts to Mumbai
- `npm run simulate` - Run data simulation
- `npm run test` - Run contract tests
- `npm run node` - Start local Hardhat node

## Testing

### Get Mumbai Testnet MATIC
1. Visit [Mumbai Faucet](https://faucet.polygon.technology/)
2. Enter your wallet address
3. Request test MATIC tokens

### MetaMask Setup
1. Add Mumbai Testnet:
   - Network Name: Mumbai Testnet
   - RPC URL: https://rpc-mumbai.maticvigil.com
   - Chain ID: 80001
   - Symbol: MATIC
   - Explorer: https://mumbai.polygonscan.com/

## Architecture

```
User → React Frontend → MetaMask → Smart Contract (Polygon Mumbai)
                            ↓
                   Fire Incident Logger
                            ↓
                  Event Emitted / Token Minted
                            ↓
                   Data Saved On-chain
                            ↓
         → Dashboard Visualization (Leaflet.js)
         → Optional: SMS via Twilio API
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Security Considerations

- All contracts use OpenZeppelin standards
- Row Level Security (RLS) implemented
- Input validation on all user inputs
- Rate limiting on API endpoints
- Private key management best practices

## License

MIT License - see LICENSE file for details

## Support

For questions or support:
- Create an issue on GitHub
- Check the documentation
- Review contract code and tests

---

**Built with ❤️ for emergency response and community safety**
