import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Radar, 
  Thermometer, 
  Wind, 
  Eye, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  Signal
} from 'lucide-react';

interface SatelliteData {
  id: string;
  name: string;
  type: 'thermal' | 'optical' | 'radar' | 'weather';
  status: 'active' | 'maintenance' | 'offline';
  coverage: string;
  lastUpdate: number;
  detections: number;
  accuracy: number;
  altitude: number;
  coordinates: [number, number];
}

interface Detection {
  id: string;
  satelliteId: string;
  timestamp: number;
  location: string;
  coordinates: [number, number];
  confidence: number;
  temperature: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'hotspot' | 'smoke' | 'flame' | 'thermal-anomaly';
  verified: boolean;
}

export const SatelliteNetwork: React.FC = () => {
  const [satellites, setSatellites] = useState<SatelliteData[]>([]);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadSatelliteData();
    loadDetections();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateSatelliteData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadSatelliteData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockSatellites: SatelliteData[] = [
        {
          id: 'LANDSAT-8',
          name: 'Landsat 8',
          type: 'thermal',
          status: 'active',
          coverage: 'North America',
          lastUpdate: Date.now() / 1000 - 300,
          detections: 47,
          accuracy: 94.2,
          altitude: 705,
          coordinates: [39.8283, -98.5795]
        },
        {
          id: 'MODIS-TERRA',
          name: 'MODIS Terra',
          type: 'optical',
          status: 'active',
          coverage: 'Global',
          lastUpdate: Date.now() / 1000 - 180,
          detections: 156,
          accuracy: 91.8,
          altitude: 705,
          coordinates: [45.0, -100.0]
        },
        {
          id: 'SENTINEL-2A',
          name: 'Sentinel-2A',
          type: 'optical',
          status: 'active',
          coverage: 'Europe & Americas',
          lastUpdate: Date.now() / 1000 - 420,
          detections: 89,
          accuracy: 96.1,
          altitude: 786,
          coordinates: [50.0, 10.0]
        },
        {
          id: 'NOAA-20',
          name: 'NOAA-20',
          type: 'weather',
          status: 'active',
          coverage: 'Global Weather',
          lastUpdate: Date.now() / 1000 - 120,
          detections: 203,
          accuracy: 88.7,
          altitude: 824,
          coordinates: [35.0, -95.0]
        },
        {
          id: 'SENTINEL-1B',
          name: 'Sentinel-1B',
          type: 'radar',
          status: 'maintenance',
          coverage: 'Europe & Asia',
          lastUpdate: Date.now() / 1000 - 3600,
          detections: 34,
          accuracy: 92.3,
          altitude: 693,
          coordinates: [55.0, 25.0]
        }
      ];
      setSatellites(mockSatellites);
      setLoading(false);
    }, 1000);
  };

  const loadDetections = async () => {
    // Simulate recent detections
    const mockDetections: Detection[] = [
      {
        id: 'DET-001',
        satelliteId: 'LANDSAT-8',
        timestamp: Date.now() / 1000 - 1800,
        location: 'Yellowstone National Park, WY',
        coordinates: [44.4280, -110.5885],
        confidence: 87.3,
        temperature: 45.2,
        severity: 'high',
        type: 'thermal-anomaly',
        verified: true
      },
      {
        id: 'DET-002',
        satelliteId: 'MODIS-TERRA',
        timestamp: Date.now() / 1000 - 2400,
        location: 'Angeles National Forest, CA',
        coordinates: [34.2411, -117.8443],
        confidence: 94.1,
        temperature: 52.8,
        severity: 'critical',
        type: 'hotspot',
        verified: true
      },
      {
        id: 'DET-003',
        satelliteId: 'SENTINEL-2A',
        timestamp: Date.now() / 1000 - 3600,
        location: 'Olympic National Forest, WA',
        coordinates: [47.8021, -123.6044],
        confidence: 76.5,
        temperature: 38.1,
        severity: 'medium',
        type: 'smoke',
        verified: false
      }
    ];
    setDetections(mockDetections);
  };

  const updateSatelliteData = () => {
    setSatellites(prev => prev.map(sat => ({
      ...sat,
      lastUpdate: Date.now() / 1000,
      detections: sat.detections + Math.floor(Math.random() * 3),
      accuracy: Math.max(85, Math.min(99, sat.accuracy + (Math.random() - 0.5) * 2))
    })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'thermal': return Thermometer;
      case 'optical': return Eye;
      case 'radar': return Radar;
      case 'weather': return Wind;
      default: return Satellite;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-forest-green bg-forest-green/20';
      case 'maintenance': return 'text-yellow-500 bg-yellow-500/20';
      case 'offline': return 'text-fire-red bg-fire-red/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const filteredSatellites = satellites.filter(sat => {
    if (filterType !== 'all' && sat.type !== filterType) return false;
    if (filterStatus !== 'all' && sat.status !== filterStatus) return false;
    return true;
  });

  const activeSatellites = satellites.filter(s => s.status === 'active').length;
  const totalDetections = satellites.reduce((sum, s) => sum + s.detections, 0);
  const avgAccuracy = satellites.reduce((sum, s) => sum + s.accuracy, 0) / satellites.length;

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
        <h1 className="text-3xl font-bold text-white mb-2">🛰️ Satellite Network</h1>
        <p className="text-gray-400">
          Real-time monitoring from space-based fire detection systems
        </p>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <Satellite className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">{activeSatellites}</p>
              <p className="text-sm text-gray-400">Active Satellites</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">{totalDetections}</p>
              <p className="text-sm text-gray-400">Total Detections</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">{avgAccuracy.toFixed(1)}%</p>
              <p className="text-sm text-gray-400">Avg Accuracy</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-sm text-gray-400">Coverage</p>
            </div>
          </div>
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
                <option value="thermal">Thermal</option>
                <option value="optical">Optical</option>
                <option value="radar">Radar</option>
                <option value="weather">Weather</option>
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
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={loadSatelliteData}
            disabled={loading}
            className="btn-secondary disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Satellites Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSatellites.map((satellite) => {
          const TypeIcon = getTypeIcon(satellite.type);
          
          return (
            <div key={satellite.id} className="glass-card p-6 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-dark-mauve/20 rounded-lg">
                    <TypeIcon className="w-6 h-6 text-soft-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{satellite.name}</h3>
                    <p className="text-sm text-gray-400">{satellite.id}</p>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(satellite.status)}`}>
                  {satellite.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Coverage</p>
                  <p className="text-white font-medium">{satellite.coverage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Altitude</p>
                  <p className="text-white font-medium">{satellite.altitude} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Detections</p>
                  <p className="text-white font-medium">{satellite.detections}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Accuracy</p>
                  <p className="text-white font-medium">{satellite.accuracy.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Updated {formatTimeAgo(satellite.lastUpdate)}</span>
                </div>
                
                <button
                  onClick={() => setSelectedSatellite(satellite)}
                  className="btn-primary text-sm py-2 px-4"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Detections */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <AlertTriangle className="w-6 h-6 text-soft-gold mr-2" />
          Recent Detections
        </h3>
        
        <div className="space-y-4">
          {detections.map((detection) => (
            <div key={detection.id} className="bg-black/30 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(detection.severity)}`}>
                      {detection.severity.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-400">
                      {detection.type.replace('-', ' ').toUpperCase()}
                    </span>
                    {detection.verified && (
                      <CheckCircle className="w-4 h-4 text-forest-green" />
                    )}
                  </div>
                  
                  <h4 className="text-white font-medium mb-1">{detection.location}</h4>
                  <p className="text-sm text-gray-400 mb-2">
                    Detected by {satellites.find(s => s.id === detection.satelliteId)?.name}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Confidence:</span>
                      <span className="text-white ml-2">{detection.confidence}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Temperature:</span>
                      <span className="text-white ml-2">{detection.temperature}°C</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white ml-2">{formatTimeAgo(detection.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Signal className="w-4 h-4 text-soft-gold" />
                  <span className="text-sm text-gray-400">{detection.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Satellite Detail Modal */}
      {selectedSatellite && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-jet-black border border-dark-mauve/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedSatellite.name} Details
              </h2>
              <button
                onClick={() => setSelectedSatellite(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Specifications</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <p className="text-white capitalize">{selectedSatellite.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Altitude:</span>
                      <p className="text-white">{selectedSatellite.altitude} km</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Coverage Area:</span>
                      <p className="text-white">{selectedSatellite.coverage}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Coordinates:</span>
                      <p className="text-white font-mono">
                        {selectedSatellite.coordinates[0].toFixed(4)}, {selectedSatellite.coordinates[1].toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Performance</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${getStatusColor(selectedSatellite.status)}`}>
                        {selectedSatellite.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Detections:</span>
                      <p className="text-white">{selectedSatellite.detections}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Accuracy Rate:</span>
                      <p className="text-white">{selectedSatellite.accuracy.toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Update:</span>
                      <p className="text-white">{formatTimeAgo(selectedSatellite.lastUpdate)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">
                    Satellite operational data and detection history would be displayed here in a real implementation.
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