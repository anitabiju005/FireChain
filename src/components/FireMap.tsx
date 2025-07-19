import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Flame, AlertTriangle, CheckCircle, Clock, Filter, Layers } from 'lucide-react';
import { apiService } from '../services/api';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface FireMapProps {
  incidents?: any[];
}

export const FireMap: React.FC<FireMapProps> = ({ incidents: propIncidents }) => {
  const [incidents, setIncidents] = useState(propIncidents || []);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'all',
    timeRange: '7d'
  });
  const [mapStyle, setMapStyle] = useState('satellite');

  useEffect(() => {
    if (!propIncidents) {
      loadIncidents();
    }
  }, [propIncidents]);

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

  // Create custom icons for different severity levels
  const createFireIcon = (severity: number, status: number) => {
    const colors = {
      0: '#22C55E', // Low - Green
      1: '#F59E0B', // Medium - Yellow
      2: '#EF4444', // High - Orange
      3: '#DC2626'  // Critical - Red
    };

    const statusOpacity = status === 2 ? 0.6 : 1; // Resolved incidents are more transparent

    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12.5" cy="12.5" r="10" fill="${colors[severity as keyof typeof colors]}" opacity="${statusOpacity}" stroke="#fff" stroke-width="2"/>
          <path d="M12.5 6 L16 14 L9 14 Z" fill="#fff"/>
        </svg>
      `)}`,
      iconSize: [25, 25],
      iconAnchor: [12.5, 12.5],
      popupAnchor: [0, -12.5]
    });
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filters.severity !== 'all' && incident.severity !== parseInt(filters.severity)) {
      return false;
    }
    if (filters.status !== 'all' && incident.status !== parseInt(filters.status)) {
      return false;
    }
    
    // Time range filter
    const now = Date.now() / 1000;
    const incidentTime = incident.timestamp;
    const timeRanges = {
      '1d': 24 * 60 * 60,
      '7d': 7 * 24 * 60 * 60,
      '30d': 30 * 24 * 60 * 60,
      'all': Infinity
    };
    
    if (filters.timeRange !== 'all') {
      const range = timeRanges[filters.timeRange as keyof typeof timeRanges];
      if (now - incidentTime > range) {
        return false;
      }
    }
    
    return true;
  });

  const getSeverityLabel = (severity: number) => {
    const labels = ['Low', 'Medium', 'High', 'Critical'];
    return labels[severity] || 'Unknown';
  };

  const getStatusLabel = (status: number) => {
    const labels = ['Reported', 'Verified', 'Resolved', 'False'];
    return labels[status] || 'Unknown';
  };

  const getStatusColor = (status: number) => {
    const colors = ['text-yellow-500', 'text-forest-green', 'text-blue-500', 'text-fire-red'];
    return colors[status] || 'text-gray-500';
  };

  // Map style configurations
  const mapStyles = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">🗺️ Fire Incident Map</h1>
          <p className="text-gray-400">
            Real-time visualization of fire incidents across the network
          </p>
        </div>

        {/* Map Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-gray-400" />
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
              className="bg-black/50 border border-dark-mauve/30 rounded-lg px-3 py-2 text-white text-sm focus:border-soft-gold focus:outline-none"
            >
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
              <option value="street">Street</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-soft-gold" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="w-full bg-black/50 border border-dark-mauve/30 rounded-lg px-3 py-2 text-white text-sm focus:border-soft-gold focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="0">Low</option>
              <option value="1">Medium</option>
              <option value="2">High</option>
              <option value="3">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full bg-black/50 border border-dark-mauve/30 rounded-lg px-3 py-2 text-white text-sm focus:border-soft-gold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="0">Reported</option>
              <option value="1">Verified</option>
              <option value="2">Resolved</option>
              <option value="3">False</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Time Range</label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
              className="w-full bg-black/50 border border-dark-mauve/30 rounded-lg px-3 py-2 text-white text-sm focus:border-soft-gold focus:outline-none"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={loadIncidents}
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="glass-card p-4">
        <div className="h-96 lg:h-[600px] rounded-lg overflow-hidden">
          <MapContainer
            center={[39.8283, -98.5795]} // Center of USA
            zoom={4}
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg"
          >
            <TileLayer
              url={mapStyles[mapStyle as keyof typeof mapStyles]}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {filteredIncidents.map((incident) => (
              <Marker
                key={incident.id}
                position={[incident.latitude, incident.longitude]}
                icon={createFireIcon(incident.severity, incident.status)}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[250px]">
                    <div className="flex items-center space-x-2 mb-3">
                      <Flame className="w-5 h-5 text-fire-red" />
                      <h3 className="font-semibold text-gray-900">Incident #{incident.id}</h3>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <p className="text-gray-600">{incident.location}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Description:</span>
                        <p className="text-gray-600">{incident.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-medium text-gray-700">Severity:</span>
                          <p className={`font-medium ${
                            incident.severity === 3 ? 'text-red-600' :
                            incident.severity === 2 ? 'text-orange-600' :
                            incident.severity === 1 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {getSeverityLabel(incident.severity)}
                          </p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <p className={`font-medium ${
                            incident.status === 0 ? 'text-yellow-600' :
                            incident.status === 1 ? 'text-green-600' :
                            incident.status === 2 ? 'text-blue-600' :
                            'text-red-600'
                          }`}>
                            {getStatusLabel(incident.status)}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Reported:</span>
                        <p className="text-gray-600">
                          {new Date(incident.timestamp * 1000).toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Reporter:</span>
                        <p className="text-gray-600 font-mono text-xs">
                          {incident.reporter.slice(0, 6)}...{incident.reporter.slice(-4)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Legend</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-forest-green"></div>
            <span className="text-sm text-gray-400">Low Severity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-400">Medium Severity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-sm text-gray-400">High Severity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-fire-red"></div>
            <span className="text-sm text-gray-400">Critical Severity</span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-white">{filteredIncidents.length}</div>
          <div className="text-sm text-gray-400">Total Incidents</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-fire-red">
            {filteredIncidents.filter(i => i.status === 0).length}
          </div>
          <div className="text-sm text-gray-400">Active</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-forest-green">
            {filteredIncidents.filter(i => i.status === 1).length}
          </div>
          <div className="text-sm text-gray-400">Verified</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">
            {filteredIncidents.filter(i => i.status === 2).length}
          </div>
          <div className="text-sm text-gray-400">Resolved</div>
        </div>
      </div>
    </div>
  );
};