import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Globe,
  Award,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useWallet } from '../hooks/useWallet';

interface CarbonCredit {
  id: string;
  projectName: string;
  location: string;
  type: 'reforestation' | 'renewable-energy' | 'fire-prevention' | 'conservation';
  credits: number;
  pricePerCredit: number;
  totalValue: number;
  verified: boolean;
  vintage: number;
  methodology: string;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'retire';
  credits: number;
  price: number;
  timestamp: number;
  projectId: string;
  status: 'pending' | 'completed' | 'failed';
}

interface Portfolio {
  totalCredits: number;
  totalValue: number;
  retiredCredits: number;
  activeProjects: number;
}

export const CarbonExchange: React.FC = () => {
  const { address, isConnected } = useWallet();
  const [credits, setCredits] = useState<CarbonCredit[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalCredits: 0,
    totalValue: 0,
    retiredCredits: 0,
    activeProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedCredit, setSelectedCredit] = useState<CarbonCredit | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');

  // Market data for charts
  const [priceHistory, setPriceHistory] = useState([
    { date: '2024-01', price: 45.2, volume: 1200 },
    { date: '2024-02', price: 47.8, volume: 1350 },
    { date: '2024-03', price: 44.1, volume: 1100 },
    { date: '2024-04', price: 49.3, volume: 1450 },
    { date: '2024-05', price: 52.7, volume: 1600 },
    { date: '2024-06', price: 48.9, volume: 1380 }
  ]);

  const [projectTypes, setProjectTypes] = useState([
    { name: 'Reforestation', value: 35, color: '#22C55E' },
    { name: 'Fire Prevention', value: 28, color: '#D4AF37' },
    { name: 'Renewable Energy', value: 22, color: '#3B82F6' },
    { name: 'Conservation', value: 15, color: '#8B5CF6' }
  ]);

  useEffect(() => {
    loadCarbonCredits();
    loadTransactions();
    loadPortfolio();
  }, []);

  const loadCarbonCredits = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockCredits: CarbonCredit[] = [
        {
          id: 'CC-001',
          projectName: 'Amazon Rainforest Protection',
          location: 'Brazil',
          type: 'conservation',
          credits: 10000,
          pricePerCredit: 52.50,
          totalValue: 525000,
          verified: true,
          vintage: 2024,
          methodology: 'VCS-REDD+'
        },
        {
          id: 'CC-002',
          projectName: 'California Fire Prevention Initiative',
          location: 'California, USA',
          type: 'fire-prevention',
          credits: 7500,
          pricePerCredit: 48.75,
          totalValue: 365625,
          verified: true,
          vintage: 2024,
          methodology: 'CAR-FPP'
        },
        {
          id: 'CC-003',
          projectName: 'Pacific Northwest Reforestation',
          location: 'Oregon, USA',
          type: 'reforestation',
          credits: 12000,
          pricePerCredit: 45.20,
          totalValue: 542400,
          verified: true,
          vintage: 2023,
          methodology: 'VCS-ARR'
        },
        {
          id: 'CC-004',
          projectName: 'Solar Farm Carbon Offset',
          location: 'Nevada, USA',
          type: 'renewable-energy',
          credits: 8500,
          pricePerCredit: 41.80,
          totalValue: 355300,
          verified: true,
          vintage: 2024,
          methodology: 'CDM-RE'
        },
        {
          id: 'CC-005',
          projectName: 'Australian Bushfire Recovery',
          location: 'Australia',
          type: 'reforestation',
          credits: 15000,
          pricePerCredit: 55.90,
          totalValue: 838500,
          verified: false,
          vintage: 2024,
          methodology: 'VCS-ARR'
        }
      ];
      setCredits(mockCredits);
      setLoading(false);
    }, 1000);
  };

  const loadTransactions = async () => {
    const mockTransactions: Transaction[] = [
      {
        id: 'TXN-001',
        type: 'buy',
        credits: 100,
        price: 52.50,
        timestamp: Date.now() / 1000 - 3600,
        projectId: 'CC-001',
        status: 'completed'
      },
      {
        id: 'TXN-002',
        type: 'retire',
        credits: 50,
        price: 48.75,
        timestamp: Date.now() / 1000 - 7200,
        projectId: 'CC-002',
        status: 'completed'
      },
      {
        id: 'TXN-003',
        type: 'sell',
        credits: 25,
        price: 45.20,
        timestamp: Date.now() / 1000 - 10800,
        projectId: 'CC-003',
        status: 'pending'
      }
    ];
    setTransactions(mockTransactions);
  };

  const loadPortfolio = async () => {
    // Simulate portfolio calculation
    setPortfolio({
      totalCredits: 1247,
      totalValue: 62350.75,
      retiredCredits: 340,
      activeProjects: 8
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reforestation': return Leaf;
      case 'renewable-energy': return Zap;
      case 'fire-prevention': return Target;
      case 'conservation': return Globe;
      default: return Leaf;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reforestation': return 'text-forest-green bg-forest-green/20';
      case 'renewable-energy': return 'text-blue-500 bg-blue-500/20';
      case 'fire-prevention': return 'text-soft-gold bg-soft-gold/20';
      case 'conservation': return 'text-purple-500 bg-purple-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleBuyCredits = async () => {
    if (!selectedCredit || !buyAmount || !isConnected) return;

    setLoading(true);
    // Simulate transaction
    setTimeout(() => {
      const newTransaction: Transaction = {
        id: `TXN-${Date.now()}`,
        type: 'buy',
        credits: parseInt(buyAmount),
        price: selectedCredit.pricePerCredit,
        timestamp: Date.now() / 1000,
        projectId: selectedCredit.id,
        status: 'completed'
      };
      
      setTransactions([newTransaction, ...transactions]);
      setPortfolio(prev => ({
        ...prev,
        totalCredits: prev.totalCredits + parseInt(buyAmount),
        totalValue: prev.totalValue + (parseInt(buyAmount) * selectedCredit.pricePerCredit)
      }));
      
      setBuyAmount('');
      setShowBuyModal(false);
      setSelectedCredit(null);
      setLoading(false);
    }, 2000);
  };

  if (loading && credits.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">🌱 Carbon Credit Exchange</h1>
        <p className="text-gray-400">
          Trade verified carbon credits from fire prevention and reforestation projects
        </p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <Leaf className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">{portfolio.totalCredits}</p>
              <p className="text-sm text-gray-400">Total Credits</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">${portfolio.totalValue.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Portfolio Value</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <Award className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">{portfolio.retiredCredits}</p>
              <p className="text-sm text-gray-400">Retired Credits</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">{portfolio.activeProjects}</p>
              <p className="text-sm text-gray-400">Active Projects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price History */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 text-soft-gold mr-2" />
            Carbon Credit Prices
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#6B4C7E" opacity={0.3} />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0A0A0A', 
                  border: '1px solid #6B4C7E',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#D4AF37" 
                strokeWidth={3}
                dot={{ fill: '#D4AF37', strokeWidth: 2, r: 4 }}
                name="Price (USD)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Project Types Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 text-soft-gold mr-2" />
            Project Types
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {projectTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0A0A0A', 
                  border: '1px solid #6B4C7E',
                  borderRadius: '8px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {projectTypes.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-400">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Credits */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Leaf className="w-6 h-6 text-soft-gold mr-2" />
            Available Carbon Credits
          </h3>
          
          <button
            onClick={loadCarbonCredits}
            disabled={loading}
            className="btn-secondary disabled:opacity-50 flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {credits.map((credit) => {
            const TypeIcon = getTypeIcon(credit.type);
            
            return (
              <div key={credit.id} className="bg-black/30 rounded-lg p-6 card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(credit.type)}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{credit.projectName}</h4>
                      <p className="text-sm text-gray-400">{credit.location}</p>
                    </div>
                  </div>
                  
                  {credit.verified && (
                    <Award className="w-5 h-5 text-soft-gold" />
                  )}
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Available Credits:</span>
                    <span className="text-white font-medium">{credit.credits.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price per Credit:</span>
                    <span className="text-white font-medium">${credit.pricePerCredit}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vintage:</span>
                    <span className="text-white font-medium">{credit.vintage}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Methodology:</span>
                    <span className="text-white font-medium text-sm">{credit.methodology}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCredit(credit);
                      setShowBuyModal(true);
                    }}
                    disabled={!isConnected}
                    className="flex-1 btn-primary disabled:opacity-50 text-sm py-2"
                  >
                    Buy Credits
                  </button>
                  
                  <button
                    onClick={() => setSelectedCredit(credit)}
                    className="px-4 py-2 bg-dark-mauve/20 hover:bg-dark-mauve/40 rounded-lg transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <BarChart3 className="w-6 h-6 text-soft-gold mr-2" />
          Recent Transactions
        </h3>
        
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const credit = credits.find(c => c.id === transaction.projectId);
            
            return (
              <div key={transaction.id} className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'buy' ? 'bg-forest-green/20 text-forest-green' :
                      transaction.type === 'sell' ? 'bg-fire-red/20 text-fire-red' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      {transaction.type === 'buy' ? <ArrowDownRight className="w-4 h-4" /> :
                       transaction.type === 'sell' ? <ArrowUpRight className="w-4 h-4" /> :
                       <Award className="w-4 h-4" />}
                    </div>
                    
                    <div>
                      <p className="text-white font-medium">
                        {transaction.type.toUpperCase()} {transaction.credits} credits
                      </p>
                      <p className="text-gray-400 text-sm">
                        {credit?.projectName || 'Unknown Project'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-white font-medium">
                      ${(transaction.credits * transaction.price).toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {formatTimeAgo(transaction.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buy Credits Modal */}
      {showBuyModal && selectedCredit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-jet-black border border-dark-mauve/30 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Buy Carbon Credits</h2>
              <button
                onClick={() => {
                  setShowBuyModal(false);
                  setSelectedCredit(null);
                  setBuyAmount('');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white">{selectedCredit.projectName}</h3>
                <p className="text-gray-400 text-sm">{selectedCredit.location}</p>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Price per Credit:</span>
                  <span className="text-white">${selectedCredit.pricePerCredit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Available:</span>
                  <span className="text-white">{selectedCredit.credits.toLocaleString()}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Credits
                </label>
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  className="input-field"
                  placeholder="Enter amount"
                  min="1"
                  max={selectedCredit.credits}
                />
              </div>
              
              {buyAmount && (
                <div className="bg-dark-mauve/20 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Cost:</span>
                    <span className="text-white font-bold">
                      ${(parseInt(buyAmount) * selectedCredit.pricePerCredit).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowBuyModal(false);
                    setSelectedCredit(null);
                    setBuyAmount('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyCredits}
                  disabled={!buyAmount || parseInt(buyAmount) <= 0 || loading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Buy Credits'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credit Detail Modal */}
      {selectedCredit && !showBuyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-jet-black border border-dark-mauve/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedCredit.projectName}
              </h2>
              <button
                onClick={() => setSelectedCredit(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Project Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Location:</span>
                      <p className="text-white">{selectedCredit.location}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <p className="text-white capitalize">{selectedCredit.type.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Methodology:</span>
                      <p className="text-white">{selectedCredit.methodology}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Vintage:</span>
                      <p className="text-white">{selectedCredit.vintage}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Market Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Available Credits:</span>
                      <p className="text-white">{selectedCredit.credits.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Price per Credit:</span>
                      <p className="text-white">${selectedCredit.pricePerCredit}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Value:</span>
                      <p className="text-white">${selectedCredit.totalValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Verified:</span>
                      <span className={`ml-2 ${selectedCredit.verified ? 'text-forest-green' : 'text-yellow-500'}`}>
                        {selectedCredit.verified ? 'Yes' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Project Description</h3>
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-gray-300">
                    Detailed project information, environmental impact, verification status, 
                    and carbon offset methodology would be displayed here in a real implementation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};