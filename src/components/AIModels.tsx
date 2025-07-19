import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Cpu, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  BarChart3,
  Eye,
  Target,
  Layers,
  Settings
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AIModel {
  id: string;
  name: string;
  type: 'detection' | 'prediction' | 'classification' | 'risk-assessment';
  status: 'active' | 'training' | 'offline';
  accuracy: number;
  confidence: number;
  lastTrained: number;
  predictions: number;
  version: string;
  description: string;
}

interface Prediction {
  id: string;
  modelId: string;
  timestamp: number;
  location: string;
  coordinates: [number, number];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  factors: string[];
  timeframe: string;
  verified: boolean;
}

export const AIModels: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Performance data for charts
  const [performanceData, setPerformanceData] = useState([
    { time: '00:00', accuracy: 94.2, predictions: 45 },
    { time: '04:00', accuracy: 95.1, predictions: 38 },
    { time: '08:00', accuracy: 93.8, predictions: 62 },
    { time: '12:00', accuracy: 96.3, predictions: 78 },
    { time: '16:00', accuracy: 94.9, predictions: 85 },
    { time: '20:00', accuracy: 95.7, predictions: 56 }
  ]);

  const [modelComparison, setModelComparison] = useState([
    { model: 'FireNet-V3', accuracy: 96.3, speed: 85, reliability: 94 },
    { model: 'ThermalAI', accuracy: 94.1, speed: 92, reliability: 89 },
    { model: 'SmokeDetect', accuracy: 91.8, speed: 78, reliability: 92 },
    { model: 'RiskPredict', accuracy: 88.5, speed: 95, reliability: 87 }
  ]);

  useEffect(() => {
    loadAIModels();
    loadPredictions();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateModelMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadAIModels = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockModels: AIModel[] = [
        {
          id: 'firenet-v3',
          name: 'FireNet V3',
          type: 'detection',
          status: 'active',
          accuracy: 96.3,
          confidence: 94.7,
          lastTrained: Date.now() / 1000 - 86400 * 2,
          predictions: 1247,
          version: '3.2.1',
          description: 'Advanced computer vision model for real-time fire detection from satellite imagery'
        },
        {
          id: 'thermal-ai',
          name: 'ThermalAI',
          type: 'detection',
          status: 'active',
          accuracy: 94.1,
          confidence: 91.2,
          lastTrained: Date.now() / 1000 - 86400 * 5,
          predictions: 892,
          version: '2.1.0',
          description: 'Thermal anomaly detection using infrared satellite data'
        },
        {
          id: 'smoke-detect',
          name: 'SmokeDetect',
          type: 'classification',
          status: 'active',
          accuracy: 91.8,
          confidence: 88.9,
          lastTrained: Date.now() / 1000 - 86400 * 3,
          predictions: 634,
          version: '1.8.2',
          description: 'Smoke plume identification and classification from optical imagery'
        },
        {
          id: 'risk-predict',
          name: 'RiskPredict',
          type: 'prediction',
          status: 'training',
          accuracy: 88.5,
          confidence: 85.3,
          lastTrained: Date.now() / 1000 - 86400 * 1,
          predictions: 445,
          version: '4.0.0-beta',
          description: 'Predictive model for fire risk assessment based on weather and environmental data'
        },
        {
          id: 'spread-model',
          name: 'SpreadModel',
          type: 'prediction',
          status: 'active',
          accuracy: 89.7,
          confidence: 87.1,
          lastTrained: Date.now() / 1000 - 86400 * 7,
          predictions: 278,
          version: '2.3.1',
          description: 'Fire spread prediction using wind patterns and terrain analysis'
        }
      ];
      setModels(mockModels);
      setLoading(false);
    }, 1000);
  };

  const loadPredictions = async () => {
    const mockPredictions: Prediction[] = [
      {
        id: 'PRED-001',
        modelId: 'risk-predict',
        timestamp: Date.now() / 1000 - 1800,
        location: 'Yosemite National Park, CA',
        coordinates: [37.8651, -119.5383],
        riskLevel: 'high',
        confidence: 87.3,
        factors: ['Low humidity', 'High winds', 'Dry vegetation'],
        timeframe: '24-48 hours',
        verified: false
      },
      {
        id: 'PRED-002',
        modelId: 'spread-model',
        timestamp: Date.now() / 1000 - 3600,
        location: 'Glacier National Park, MT',
        coordinates: [48.7596, -113.7870],
        riskLevel: 'medium',
        confidence: 92.1,
        factors: ['Wind direction change', 'Temperature rise'],
        timeframe: '12-24 hours',
        verified: true
      },
      {
        id: 'PRED-003',
        modelId: 'firenet-v3',
        timestamp: Date.now() / 1000 - 5400,
        location: 'Olympic National Forest, WA',
        coordinates: [47.8021, -123.6044],
        riskLevel: 'critical',
        confidence: 94.8,
        factors: ['Extreme drought', 'Lightning activity', 'Dead fuel load'],
        timeframe: '6-12 hours',
        verified: true
      }
    ];
    setPredictions(mockPredictions);
  };

  const updateModelMetrics = () => {
    setModels(prev => prev.map(model => ({
      ...model,
      predictions: model.predictions + Math.floor(Math.random() * 5),
      accuracy: Math.max(85, Math.min(99, model.accuracy + (Math.random() - 0.5) * 2)),
      confidence: Math.max(80, Math.min(99, model.confidence + (Math.random() - 0.5) * 3))
    })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'detection': return Eye;
      case 'prediction': return TrendingUp;
      case 'classification': return Layers;
      case 'risk-assessment': return Target;
      default: return Brain;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-forest-green bg-forest-green/20';
      case 'training': return 'text-yellow-500 bg-yellow-500/20';
      case 'offline': return 'text-fire-red bg-fire-red/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-fire-red bg-fire-red/20';
      case 'high': return 'text-orange-500 bg-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20';
      case 'low': return 'text-forest-green bg-forest-green/20';
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

  const filteredModels = models.filter(model => {
    if (filterType !== 'all' && model.type !== filterType) return false;
    if (filterStatus !== 'all' && model.status !== filterStatus) return false;
    return true;
  });

  const activeModels = models.filter(m => m.status === 'active').length;
  const totalPredictions = models.reduce((sum, m) => sum + m.predictions, 0);
  const avgAccuracy = models.reduce((sum, m) => sum + m.accuracy, 0) / models.length;

  if (loading) {
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
        <h1 className="text-3xl font-bold text-white mb-2">🧠 AI Models</h1>
        <p className="text-gray-400">
          Advanced machine learning models for fire detection, prediction, and risk assessment
        </p>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">{activeModels}</p>
              <p className="text-sm text-gray-400">Active Models</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">{totalPredictions}</p>
              <p className="text-sm text-gray-400">Predictions Made</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">{avgAccuracy.toFixed(1)}%</p>
              <p className="text-sm text-gray-400">Avg Accuracy</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">Real-time</p>
              <p className="text-sm text-gray-400">Processing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Performance Over Time */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 text-soft-gold mr-2" />
            Performance Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#6B4C7E" opacity={0.3} />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0A0A0A', 
                  border: '1px solid #6B4C7E',
                  borderRadius: '8px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#D4AF37" 
                fill="#D4AF37" 
                fillOpacity={0.3}
                name="Accuracy %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Model Comparison */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Cpu className="w-6 h-6 text-soft-gold mr-2" />
            Model Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#6B4C7E" opacity={0.3} />
              <XAxis dataKey="model" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0A0A0A', 
                  border: '1px solid #6B4C7E',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="accuracy" fill="#D4AF37" name="Accuracy" />
              <Bar dataKey="speed" fill="#6B4C7E" name="Speed" />
              <Bar dataKey="reliability" fill="#22C55E" name="Reliability" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-black/50 border border-dark-mauve/30 rounded-lg px-3 py-2 text-white focus:border-soft-gold focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="detection">Detection</option>
                <option value="prediction">Prediction</option>
                <option value="classification">Classification</option>
                <option value="risk-assessment">Risk Assessment</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-black/50 border border-dark-mauve/30 rounded-lg px-3 py-2 text-white focus:border-soft-gold focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="training">Training</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={loadAIModels}
            disabled={loading}
            className="btn-secondary disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModels.map((model) => {
          const TypeIcon = getTypeIcon(model.type);
          
          return (
            <div key={model.id} className="glass-card p-6 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-dark-mauve/20 rounded-lg">
                    <TypeIcon className="w-6 h-6 text-soft-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                    <p className="text-sm text-gray-400">v{model.version}</p>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                  {model.status.toUpperCase()}
                </span>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{model.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Accuracy</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-black/50 rounded-full h-2">
                      <div 
                        className="bg-soft-gold h-2 rounded-full transition-all duration-300"
                        style={{ width: `${model.accuracy}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium text-sm">{model.accuracy.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Confidence</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-black/50 rounded-full h-2">
                      <div 
                        className="bg-forest-green h-2 rounded-full transition-all duration-300"
                        style={{ width: `${model.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium text-sm">{model.confidence.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Predictions</p>
                  <p className="text-white font-medium">{model.predictions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Trained</p>
                  <p className="text-white font-medium">{formatTimeAgo(model.lastTrained)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 capitalize">
                  {model.type.replace('-', ' ')}
                </span>
                
                <button
                  onClick={() => setSelectedModel(model)}
                  className="btn-primary text-sm py-2 px-4"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Predictions */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 text-soft-gold mr-2" />
          Recent Predictions
        </h3>
        
        <div className="space-y-4">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="bg-black/30 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(prediction.riskLevel)}`}>
                      {prediction.riskLevel.toUpperCase()} RISK
                    </span>
                    <span className="text-sm text-gray-400">
                      {prediction.timeframe}
                    </span>
                    {prediction.verified && (
                      <CheckCircle className="w-4 h-4 text-forest-green" />
                    )}
                  </div>
                  
                  <h4 className="text-white font-medium mb-1">{prediction.location}</h4>
                  <p className="text-sm text-gray-400 mb-2">
                    Predicted by {models.find(m => m.id === prediction.modelId)?.name}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {prediction.factors.map((factor, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-dark-mauve/20 text-dark-mauve text-xs rounded"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div>
                      <span className="text-gray-400">Confidence:</span>
                      <span className="text-white ml-2">{prediction.confidence}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white ml-2">{formatTimeAgo(prediction.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-soft-gold" />
                  <span className="text-sm text-gray-400">{prediction.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Detail Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-jet-black border border-dark-mauve/30 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedModel.name} Details
              </h2>
              <button
                onClick={() => setSelectedModel(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Model Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <p className="text-white capitalize">{selectedModel.type.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Version:</span>
                      <p className="text-white">{selectedModel.version}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${getStatusColor(selectedModel.status)}`}>
                        {selectedModel.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Description:</span>
                      <p className="text-white">{selectedModel.description}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Accuracy:</span>
                      <p className="text-white">{selectedModel.accuracy.toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Confidence:</span>
                      <p className="text-white">{selectedModel.confidence.toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Predictions:</span>
                      <p className="text-white">{selectedModel.predictions.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Training:</span>
                      <p className="text-white">{formatTimeAgo(selectedModel.lastTrained)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Training Data & Configuration</h3>
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">
                    Detailed model configuration, training datasets, hyperparameters, and performance history would be displayed here in a real implementation.
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