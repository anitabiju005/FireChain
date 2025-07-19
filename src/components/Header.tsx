import React from 'react';
import { 
  Flame, 
  Map, 
  List, 
  Users, 
  Satellite, 
  Brain, 
  Leaf, 
  Settings,
  Wallet,
  Bell
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useNotification } from '../hooks/useNotification';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();
  const { notifications, unreadCount } = useNotification();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Flame },
    { id: 'map', label: 'Fire Map', icon: Map },
    { id: 'incidents', label: 'Incidents', icon: List },
    { id: 'reports', label: 'Community', icon: Users },
    { id: 'satellite', label: 'Satellite', icon: Satellite },
    { id: 'ai', label: 'AI Models', icon: Brain },
    { id: 'carbon', label: 'Carbon', icon: Leaf },
    { id: 'contracts', label: 'Contracts', icon: Settings }
  ];

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-jet-black/95 backdrop-blur-sm border-b border-dark-mauve/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="fire-flicker">
              <Flame className="w-8 h-8 text-soft-gold" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FireChain</h1>
              <p className="text-xs text-gray-400">Blockchain Fire Response</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-dark-mauve text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-dark-mauve/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-fire-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-400">Connected</p>
                  <p className="text-sm font-mono text-soft-gold">
                    {formatAddress(address)}
                  </p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="flex items-center space-x-2 px-4 py-2 bg-dark-mauve/20 hover:bg-dark-mauve/40 rounded-lg transition-colors"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="btn-primary flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden pb-4">
          <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-dark-mauve text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-mauve/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};