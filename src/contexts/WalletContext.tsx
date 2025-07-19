import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { blockchainService } from '../services/blockchain';

interface WalletContextType {
  address: string;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if wallet was previously connected
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (window.ethereum && blockchainService.isConnected()) {
        const addr = await blockchainService.getAddress();
        setAddress(addr);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAddress(accounts[0]);
      setIsConnected(true);
    }
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const addr = await blockchainService.connectWallet();
      setAddress(addr);
      setIsConnected(true);
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress('');
    setIsConnected(false);
    setError(null);
  };

  const value: WalletContextType = {
    address,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    error
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export { WalletContext }