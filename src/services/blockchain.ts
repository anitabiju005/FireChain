import { ethers } from 'ethers';

// Contract ABIs
export const FIRE_INCIDENT_LOGGER_ABI = [
  "function reportIncident(string memory location, string memory description, int256 latitude, int256 longitude, uint8 severity) external returns (uint256)",
  "function getIncident(uint256 incidentId) external view returns (tuple(uint256 id, string location, string description, int256 latitude, int256 longitude, uint256 timestamp, address reporter, uint8 severity, uint8 status, address verifier, uint256 verificationTimestamp, bool rewardClaimed))",
  "function getTotalIncidents() external view returns (uint256)",
  "function verifyIncident(uint256 incidentId, uint8 status) external",
  "function getReporterIncidents(address reporter) external view returns (uint256[])",
  "event IncidentReported(uint256 indexed incidentId, address indexed reporter, string location, uint8 severity, uint256 timestamp)",
  "event IncidentVerified(uint256 indexed incidentId, address indexed verifier, uint8 status, uint256 timestamp)"
];

export const FIRECHAIN_TOKEN_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export const EMERGENCY_FUND_ABI = [
  "function requestFunds(uint256 incidentId, uint256 requestedAmount, string memory justification) external returns (uint256)",
  "function approveFundRequest(uint256 requestId) external",
  "function disburseFunds(uint256 requestId) external",
  "function getFundRequest(uint256 requestId) external view returns (tuple(uint256 incidentId, uint256 requestedAmount, address requester, string justification, uint256 timestamp, bool approved, bool disbursed))",
  "function totalFundsAvailable() external view returns (uint256)"
];

// Contract addresses (to be set from environment variables)
export const CONTRACT_ADDRESSES = {
  FIRECHAIN_TOKEN: import.meta.env.VITE_FIRECHAIN_TOKEN_ADDRESS || '',
  FIRE_INCIDENT_LOGGER: import.meta.env.VITE_FIRE_INCIDENT_LOGGER_ADDRESS || '',
  EMERGENCY_FUND_MANAGER: import.meta.env.VITE_EMERGENCY_FUND_MANAGER_ADDRESS || ''
};

export class BlockchainService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    await this.provider.send("eth_requestAccounts", []);
    this.signer = this.provider.getSigner();
    
    const address = await this.signer.getAddress();
    
    // Switch to Mumbai testnet if not already
    await this.switchToMumbai();
    
    return address;
  }

  async switchToMumbai(): Promise<void> {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }], // Mumbai testnet
      });
    } catch (switchError: any) {
      // Chain not added to MetaMask
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x13881',
            chainName: 'Mumbai Testnet',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18
            },
            rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
            blockExplorerUrls: ['https://mumbai.polygonscan.com/']
          }]
        });
      }
    }
  }

  getFireIncidentLogger(): ethers.Contract {
    if (!this.signer || !CONTRACT_ADDRESSES.FIRE_INCIDENT_LOGGER) {
      throw new Error('Wallet not connected or contract address not set');
    }
    return new ethers.Contract(
      CONTRACT_ADDRESSES.FIRE_INCIDENT_LOGGER,
      FIRE_INCIDENT_LOGGER_ABI,
      this.signer
    );
  }

  getFireChainToken(): ethers.Contract {
    if (!this.signer || !CONTRACT_ADDRESSES.FIRECHAIN_TOKEN) {
      throw new Error('Wallet not connected or contract address not set');
    }
    return new ethers.Contract(
      CONTRACT_ADDRESSES.FIRECHAIN_TOKEN,
      FIRECHAIN_TOKEN_ABI,
      this.signer
    );
  }

  getEmergencyFundManager(): ethers.Contract {
    if (!this.signer || !CONTRACT_ADDRESSES.EMERGENCY_FUND_MANAGER) {
      throw new Error('Wallet not connected or contract address not set');
    }
    return new ethers.Contract(
      CONTRACT_ADDRESSES.EMERGENCY_FUND_MANAGER,
      EMERGENCY_FUND_ABI,
      this.signer
    );
  }

  async reportIncident(
    location: string,
    description: string,
    latitude: number,
    longitude: number,
    severity: number
  ): Promise<{ transactionHash: string; incidentId?: number }> {
    const contract = this.getFireIncidentLogger();
    
    // Convert coordinates to fixed-point integers
    const lat = Math.floor(latitude * 1e6);
    const lng = Math.floor(longitude * 1e6);
    
    const tx = await contract.reportIncident(location, description, lat, lng, severity);
    const receipt = await tx.wait();
    
    // Extract incident ID from event logs
    const event = receipt.events?.find((e: any) => e.event === 'IncidentReported');
    const incidentId = event?.args?.incidentId?.toNumber();
    
    return {
      transactionHash: receipt.transactionHash,
      incidentId
    };
  }

  async getIncident(incidentId: number): Promise<any> {
    const contract = this.getFireIncidentLogger();
    const incident = await contract.getIncident(incidentId);
    
    return {
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
    };
  }

  async getTotalIncidents(): Promise<number> {
    const contract = this.getFireIncidentLogger();
    const total = await contract.getTotalIncidents();
    return total.toNumber();
  }

  async getTokenBalance(address: string): Promise<string> {
    const contract = this.getFireChainToken();
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    return ethers.utils.formatUnits(balance, decimals);
  }

  async verifyIncident(incidentId: number, status: number): Promise<string> {
    const contract = this.getFireIncidentLogger();
    const tx = await contract.verifyIncident(incidentId, status);
    const receipt = await tx.wait();
    return receipt.transactionHash;
  }

  async requestEmergencyFunds(
    incidentId: number,
    amount: string,
    justification: string
  ): Promise<{ transactionHash: string; requestId?: number }> {
    const contract = this.getEmergencyFundManager();
    const amountWei = ethers.utils.parseEther(amount);
    
    const tx = await contract.requestFunds(incidentId, amountWei, justification);
    const receipt = await tx.wait();
    
    return {
      transactionHash: receipt.transactionHash
    };
  }

  isConnected(): boolean {
    return !!this.signer;
  }

  async getAddress(): Promise<string> {
    if (!this.signer) throw new Error('Wallet not connected');
    return await this.signer.getAddress();
  }
}

export const blockchainService = new BlockchainService();