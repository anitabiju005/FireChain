import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  Activity
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { apiService } from '../services/api';

interface DashboardStats {
  totalIncidents: number;
  activeIncidents: number;
  resolvedIncidents: number;
  totalRewards: number;
  communityMembers: number;
  responseTime: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalIncidents: 0,
    activeIncidents: 0,
    resolvedIncidents: 0,
    totalRewards: 0,
    communityMembers: 1247,
    responseTime: 12
  });
  
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  // Mock data for charts
  const incidentTrends = [
    { month: 'Jan', incidents: 12, resolved: 10 },
    { month: 'Feb', incidents: 19, resolved: 16 },
    { month: 'Mar', incidents: 8, resolved: 8 },
    { month: 'Apr', incidents: 15, resolved: 12 },
    { month: 'May', incidents: 22, resolved: 18 },
    { month: 'Jun', incidents: 18, resolved: 15 }
  ];

  const severityData = [
    { name: 'Low', value: 35, color: '#22C55E' },
    { name: 'Medium', value: 28, color: '#F59E0B' },
    { name: 'High', value: 25, color: '#EF4444' },
    { name: 'Critical', value: 12, color: '#DC2626' }
  ];

  const responseTimeData = [
    { time: '00:00', avgTime: 15 },
    { time: '04:00', avgTime: 12 },
    { time: '08:00', avgTime: 18 },
    { time: '12:00', avgTime: 22 },
    { time: '16:00', avgTime: 25 },
    { time: '20:00', avgTime: 20 }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const incidentsData = await apiService.getIncidents();
      
      const totalIncidents = incidentsData.total;
      const activeIncidents = incidentsData.incidents.filter(i => i.status === 0 || i.status === 1).length;
      const resolvedIncidents = incidentsData.incidents.filter(i => i.status === 2).length;
      
      setStats(prev => ({
        ...prev,
        totalIncidents,
        activeIncidents,
        resolvedIncidents,
        totalRewards: totalIncidents * 10 // Assuming 10 FCT per incident
      }));
      
      // Set recent activity (last 5 incidents)
      const recent = incidentsData.incidents
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5);
      setRecentActivity(recent);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'text-soft-gold', trend }: any) => (
    <div className="glass-card p-6 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${
          color === 'text-soft-gold' ? 'from-soft-gold/20 to-soft-gold/10' :
          color === 'text-fire-red' ? 'from-fire-red/20 to-fire-red/10' :
          color === 'text-forest-green' ? 'from-forest-green/20 to-forest-green/10' :
          'from-sky-blue/20 to-sky-blue/10'
        }`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${trend > 0 ? 'text-forest-green' : 'text-fire-red'}`}>
            <TrendingUp className="w-4 h-4" />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          🔥 FireChain Dashboard
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Real-time monitoring of fire incidents, community response, and blockchain rewards across the network
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Flame}
          title="Total Incidents"
          value={stats.totalIncidents}
          subtitle="All time reports"
          color="text-fire-red"
          trend={8}
        />
        <StatCard
          icon={AlertTriangle}
          title="Active Incidents"
          value={stats.activeIncidents}
          subtitle="Requiring attention"
          color="text-soft-gold"
          trend={-12}
        />
        <StatCard
          icon={CheckCircle}
          title="Resolved"
          value={stats.resolvedIncidents}
          subtitle="Successfully handled"
          color="text-forest-green"
          trend={15}
        />
        <StatCard
          icon={DollarSign}
          title="FCT Rewards"
          value={`${stats.totalRewards} FCT`}
          subtitle="Community earned"
          color="text-soft-gold"
          trend={22}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Incident Trends */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 text-soft-gold mr-2" />
            Incident Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={incidentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#6B4C7E" opacity={0.3} />
              <XAxis dataKey="month" stroke="#9CA3AF" />
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
                dataKey="incidents" 
                stroke="#D4AF37" 
                fill="#D4AF37" 
                fillOpacity={0.3}
                name="Reported"
              />
              <Area 
                type="monotone" 
                dataKey="resolved" 
                stroke="#22C55E" 
                fill="#22C55E" 
                fillOpacity={0.3}
                name="Resolved"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 text-soft-gold mr-2" />
            Severity Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {severityData.map((entry, index) => (
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
          <div className="grid grid-cols-2 gap-4 mt-4">
            {severityData.map((item) => (
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

      {/* Response Time Chart */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Clock className="w-5 h-5 text-soft-gold mr-2" />
          Average Response Time (minutes)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={responseTimeData}>
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
            <Line 
              type="monotone" 
              dataKey="avgTime" 
              stroke="#D4AF37" 
              strokeWidth={3}
              dot={{ fill: '#D4AF37', strokeWidth: 2, r: 4 }}
              name="Avg Response Time"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity & Community Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 text-soft-gold mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.slice(0, 5).map((incident: any, index) => (
              <div key={incident.id} className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg">
                <div className={`p-2 rounded-full ${
                  incident.severity === 3 ? 'bg-fire-red/20 text-fire-red' :
                  incident.severity === 2 ? 'bg-orange-500/20 text-orange-500' :
                  incident.severity === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-forest-green/20 text-forest-green'
                }`}>
                  <Flame className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{incident.location}</p>
                  <p className="text-gray-400 text-sm">{incident.description}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(incident.timestamp * 1000).toLocaleString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  incident.status === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                  incident.status === 1 ? 'bg-forest-green/20 text-forest-green' :
                  incident.status === 2 ? 'bg-blue-500/20 text-blue-500' :
                  'bg-fire-red/20 text-fire-red'
                }`}>
                  {incident.status === 0 ? 'Reported' :
                   incident.status === 1 ? 'Verified' :
                   incident.status === 2 ? 'Resolved' : 'False'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 text-soft-gold mr-2" />
              Community
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-white">{stats.communityMembers}</p>
                <p className="text-gray-400 text-sm">Active Members</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.responseTime}min</p>
                <p className="text-gray-400 text-sm">Avg Response Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">98.5%</p>
                <p className="text-gray-400 text-sm">Accuracy Rate</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 text-soft-gold mr-2" />
              Coverage
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">North America</span>
                <span className="text-white">85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Europe</span>
                <span className="text-white">72%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Asia Pacific</span>
                <span className="text-white">68%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">South America</span>
                <span className="text-white">45%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};