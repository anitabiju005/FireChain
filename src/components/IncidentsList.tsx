import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User, 
  Calendar,
  Filter,
  Search,
  ExternalLink,
  Eye
} from 'lucide-react';
import { apiService } from '../services/api';

interface Incident {
  id: number;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  reporter: string;
  severity: number;
  status: number;
  verifier: string;
  verificationTimestamp: number;
  rewardClaimed: boolean;
}

export const IncidentsList: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'all',
    timeRange: 'all'
  });
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await apiService.getIncidents();
      setIncidents(data.incidents);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityLabel = (severity: number) => {
    const labels = ['Low', 'Medium', 'High', 'Critical'];
    return labels[severity] || 'Unknown';
  };

  const getSeverityColor = (severity: number) => {
    const colors = ['text-forest-green', 'text-yellow-500', 'text-orange-500', 'text-fire-red'];
    return colors[severity] || 'text-gray-500';
  };

  const getSeverityBg = (severity: number) => {
    const colors = ['bg-forest-green/20', 'bg-yellow-500/20', 'bg-orange-500/20', 'bg-fire-red/20'];
    return colors[severity] || 'bg-gray-500/20';
  };

  const getStatusLabel = (status: number) => {
    const labels = ['Reported', 'Verified', 'Resolved', 'False'];
    return labels[status] || 'Unknown';
  };

  const getStatusColor = (status: number) => {
    const colors = ['text-yellow-500', 'text-forest-green', 'text-blue-500', 'text-fire-red'];
    return colors[status] || 'text-gray-500';
  };

  const getStatusBg = (status: number) => {
    const colors = ['bg-yellow-500/20', 'bg-forest-green/20', 'bg-blue-500/20', 'bg-fire-red/20'];
    return colors[status] || 'bg-gray-500/20';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Filter and sort incidents
  const filteredAndSortedIncidents = incidents
    .filter(incident => {
      // Search filter
      if (searchTerm && !incident.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !incident.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Severity filter
      if (filters.severity !== 'all' && incident.severity !== parseInt(filters.severity)) {
        return false;
      }
      
      // Status filter
      if (filters.status !== 'all' && incident.status !== parseInt(filters.status)) {
        return false;
      }
      
      // Time range filter
      if (filters.timeRange !== 'all') {
        const now = Date.now() / 1000;
        const timeRanges = {
          '1d': 24 * 60 * 60,
          '7d': 7 * 24 * 60 * 60,
          '30d': 30 * 24 * 60 * 60
        };
        const range = timeRanges[filters.timeRange as keyof typeof timeRanges];
        if (now - incident.timestamp > range) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'severity':
          aValue = a.severity;
          bValue = b.severity;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'location':
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
          break;
        default:
          aValue = a.timestamp;
          bValue = b.timestamp;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

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
        <h1 className="text-3xl font-bold text-white mb-2">📋 Fire Incidents</h1>
        <p className="text-gray-400">
          Comprehensive list of all fire incidents reported on the network
        </p>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-soft-gold" />
            <h3 className="text-lg font-semibold text-white">Search & Filter</h3>
          </div>
          
          <button
            onClick={loadIncidents}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search location or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-dark-mauve/30 rounded-lg text-white placeholder-gray-400 focus:border-soft-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="w-full px-3 py-2 bg-black/50 border border-dark-mauve/30 rounded-lg text-white focus:border-soft-gold focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="0">Low</option>
              <option value="1">Medium</option>
              <option value="2">High</option>
              <option value="3">Critical</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 bg-black/50 border border-dark-mauve/30 rounded-lg text-white focus:border-soft-gold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="0">Reported</option>
              <option value="1">Verified</option>
              <option value="2">Resolved</option>
              <option value="3">False</option>
            </select>
          </div>

          {/* Time Range Filter */}
          <div>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
              className="w-full px-3 py-2 bg-black/50 border border-dark-mauve/30 rounded-lg text-white focus:border-soft-gold focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-4 mt-4">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 bg-black/50 border border-dark-mauve/30 rounded text-white text-sm focus:border-soft-gold focus:outline-none"
          >
            <option value="timestamp">Date</option>
            <option value="severity">Severity</option>
            <option value="status">Status</option>
            <option value="location">Location</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1 bg-dark-mauve/20 hover:bg-dark-mauve/40 rounded text-white text-sm transition-colors"
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          Showing {filteredAndSortedIncidents.length} of {incidents.length} incidents
        </p>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredAndSortedIncidents.map((incident) => (
          <div key={incident.id} className="glass-card p-6 card-hover">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Main Info */}
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${getSeverityBg(incident.severity)}`}>
                    <Flame className={`w-6 h-6 ${getSeverityColor(incident.severity)}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        Incident #{incident.id}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBg(incident.severity)} ${getSeverityColor(incident.severity)}`}>
                        {getSeverityLabel(incident.severity)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(incident.status)} ${getStatusColor(incident.status)}`}>
                        {getStatusLabel(incident.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{incident.location}</span>
                    </div>
                    
                    <p className="text-gray-300 mb-3">{incident.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Reporter:</span>
                        <span className="font-mono text-soft-gold">
                          {formatAddress(incident.reporter)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Reported:</span>
                        <span className="text-white">{getTimeAgo(incident.timestamp)}</span>
                      </div>
                      
                      {incident.verifier && incident.verifier !== '0x0000000000000000000000000000000000000000' && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">Verifier:</span>
                          <span className="font-mono text-soft-gold">
                            {formatAddress(incident.verifier)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedIncident(incident)}
                  className="flex items-center space-x-2 px-4 py-2 bg-dark-mauve/20 hover:bg-dark-mauve/40 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View Details</span>
                </button>
                
                <a
                  href={`https://mumbai.polygonscan.com/address/${incident.reporter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-soft-gold/20 hover:bg-soft-gold/40 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">Explorer</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedIncidents.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Flame className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No incidents found</h3>
          <p className="text-gray-400">
            {searchTerm || filters.severity !== 'all' || filters.status !== 'all' || filters.timeRange !== 'all'
              ? 'Try adjusting your search criteria or filters'
              : 'No fire incidents have been reported yet'}
          </p>
        </div>
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-jet-black border border-dark-mauve/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Incident #{selectedIncident.id} Details
              </h2>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Location:</span>
                      <p className="text-white">{selectedIncident.location}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Description:</span>
                      <p className="text-white">{selectedIncident.description}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Coordinates:</span>
                      <p className="text-white font-mono">
                        {selectedIncident.latitude.toFixed(6)}, {selectedIncident.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Status & Classification</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Severity:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${getSeverityBg(selectedIncident.severity)} ${getSeverityColor(selectedIncident.severity)}`}>
                        {getSeverityLabel(selectedIncident.severity)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${getStatusBg(selectedIncident.status)} ${getStatusColor(selectedIncident.status)}`}>
                        {getStatusLabel(selectedIncident.status)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Reward Claimed:</span>
                      <span className={`ml-2 ${selectedIncident.rewardClaimed ? 'text-forest-green' : 'text-yellow-500'}`}>
                        {selectedIncident.rewardClaimed ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-soft-gold rounded-full"></div>
                    <div>
                      <p className="text-white">Incident Reported</p>
                      <p className="text-gray-400 text-sm">{formatDate(selectedIncident.timestamp)}</p>
                      <p className="text-gray-500 text-xs font-mono">by {selectedIncident.reporter}</p>
                    </div>
                  </div>
                  
                  {selectedIncident.verificationTimestamp > 0 && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-forest-green rounded-full"></div>
                      <div>
                        <p className="text-white">Incident Verified</p>
                        <p className="text-gray-400 text-sm">{formatDate(selectedIncident.verificationTimestamp)}</p>
                        <p className="text-gray-500 text-xs font-mono">by {selectedIncident.verifier}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};