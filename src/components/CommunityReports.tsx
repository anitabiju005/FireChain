import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Award,
  TrendingUp,
  Camera,
  MapPin,
  Clock,
  Send,
  Image as ImageIcon
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

interface CommunityReport {
  id: number;
  author: string;
  authorName: string;
  content: string;
  images: string[];
  location: string;
  timestamp: number;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  verified: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}

interface Comment {
  id: number;
  author: string;
  authorName: string;
  content: string;
  timestamp: number;
  upvotes: number;
}

export const CommunityReports: React.FC = () => {
  const { address, isConnected } = useWallet();
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewReportForm, setShowNewReportForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'verified'>('recent');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  // New report form state
  const [newReport, setNewReport] = useState({
    content: '',
    location: '',
    severity: 'medium' as const,
    tags: [] as string[],
    images: [] as string[]
  });

  // Mock data for community reports
  useEffect(() => {
    loadCommunityReports();
  }, []);

  const loadCommunityReports = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockReports: CommunityReport[] = [
        {
          id: 1,
          author: '0x1234...5678',
          authorName: 'FireWatcher_42',
          content: 'Spotted smoke rising from the forest area near Highway 101. Visibility is getting poor and I can smell burning wood. Local wildlife seems to be moving away from the area.',
          images: ['https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg'],
          location: 'Highway 101, Northern California',
          timestamp: Date.now() / 1000 - 3600,
          upvotes: 24,
          downvotes: 2,
          comments: [
            {
              id: 1,
              author: '0x9876...4321',
              authorName: 'LocalResident',
              content: 'I can confirm this. Called 911 already.',
              timestamp: Date.now() / 1000 - 3000,
              upvotes: 8
            }
          ],
          verified: true,
          severity: 'high',
          tags: ['wildfire', 'highway', 'evacuation-needed']
        },
        {
          id: 2,
          author: '0x5555...7777',
          authorName: 'SatelliteWatcher',
          content: 'Thermal imaging from my drone shows multiple hotspots in Yellowstone. Temperature readings are concerning. Wind patterns suggest potential spread towards camping areas.',
          images: ['https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg'],
          location: 'Yellowstone National Park, WY',
          timestamp: Date.now() / 1000 - 7200,
          upvotes: 45,
          downvotes: 1,
          comments: [],
          verified: true,
          severity: 'critical',
          tags: ['thermal-imaging', 'yellowstone', 'camping', 'drone-surveillance']
        },
        {
          id: 3,
          author: '0x3333...9999',
          authorName: 'HikerAlert',
          content: 'Small grass fire spotted during morning hike. Seems contained but worth monitoring. No immediate threat to trails.',
          images: [],
          location: 'Blue Ridge Mountains, VA',
          timestamp: Date.now() / 1000 - 10800,
          upvotes: 12,
          downvotes: 0,
          comments: [],
          verified: false,
          severity: 'low',
          tags: ['grass-fire', 'hiking', 'contained']
        }
      ];
      setReports(mockReports);
      setLoading(false);
    }, 1000);
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

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const report: CommunityReport = {
        id: reports.length + 1,
        author: address,
        authorName: `User_${address.slice(-4)}`,
        content: newReport.content,
        images: newReport.images,
        location: newReport.location,
        timestamp: Date.now() / 1000,
        upvotes: 0,
        downvotes: 0,
        comments: [],
        verified: false,
        severity: newReport.severity,
        tags: newReport.tags
      };
      
      setReports([report, ...reports]);
      setNewReport({
        content: '',
        location: '',
        severity: 'medium',
        tags: [],
        images: []
      });
      setShowNewReportForm(false);
      setLoading(false);
    }, 1000);
  };

  const filteredAndSortedReports = reports
    .filter(report => filterSeverity === 'all' || report.severity === filterSeverity)
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        case 'verified':
          return Number(b.verified) - Number(a.verified);
        default:
          return b.timestamp - a.timestamp;
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">👥 Community Reports</h1>
          <p className="text-gray-400">
            Real-time fire reports and observations from the community
          </p>
        </div>

        <button
          onClick={() => setShowNewReportForm(true)}
          disabled={!isConnected}
          className="btn-primary disabled:opacity-50"
        >
          📝 Submit Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">{reports.length}</p>
              <p className="text-sm text-gray-400">Total Reports</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">
                {reports.filter(r => r.verified).length}
              </p>
              <p className="text-sm text-gray-400">Verified</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">
                {reports.reduce((sum, r) => sum + r.upvotes, 0)}
              </p>
              <p className="text-sm text-gray-400">Total Upvotes</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-soft-gold" />
            <div>
              <p className="text-2xl font-bold text-white">
                {reports.reduce((sum, r) => sum + r.comments.length, 0)}
              </p>
              <p className="text-sm text-gray-400">Comments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black/50 border border-dark-mauve/30 rounded-lg px-3 py-2 text-white focus:border-soft-gold focus:outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="verified">Verified First</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Filter by Severity</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-black/50 border border-dark-mauve/30 rounded-lg px-3 py-2 text-white focus:border-soft-gold focus:outline-none"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={loadCommunityReports}
            disabled={loading}
            className="btn-secondary disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {filteredAndSortedReports.map((report) => (
          <div key={report.id} className="glass-card p-6 card-hover">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-dark-mauve rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-white">{report.authorName}</h3>
                  <span className="text-gray-400 text-sm font-mono">
                    {report.author.slice(0, 6)}...{report.author.slice(-4)}
                  </span>
                  {report.verified && (
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-soft-gold" />
                      <span className="text-xs text-soft-gold">Verified</span>
                    </div>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                    {report.severity.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{report.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeAgo(report.timestamp)}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{report.content}</p>
                
                {/* Images */}
                {report.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    {report.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Report image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                
                {/* Tags */}
                {report.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {report.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-dark-mauve/20 text-dark-mauve text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-forest-green transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{report.upvotes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-fire-red transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-sm">{report.downvotes}</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-soft-gold transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{report.comments.length} comments</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Report Modal */}
      {showNewReportForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-jet-black border border-dark-mauve/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Submit Community Report</h2>
              <button
                onClick={() => setShowNewReportForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitReport} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={newReport.location}
                  onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Highway 101, Northern California"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Severity Level *
                </label>
                <select
                  value={newReport.severity}
                  onChange={(e) => setNewReport({ ...newReport, severity: e.target.value as any })}
                  className="input-field"
                  required
                >
                  <option value="low">Low - Minor concern</option>
                  <option value="medium">Medium - Moderate threat</option>
                  <option value="high">High - Significant danger</option>
                  <option value="critical">Critical - Immediate evacuation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={newReport.content}
                  onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                  className="input-field"
                  rows={4}
                  placeholder="Describe what you observed, including smoke, flames, weather conditions, and any immediate threats..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  onChange={(e) => setNewReport({ 
                    ...newReport, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  className="input-field"
                  placeholder="e.g., wildfire, evacuation-needed, highway"
                />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewReportForm(false)}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !newReport.content || !newReport.location}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-jet-black border border-dark-mauve/30 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Report Details</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Report content would go here */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-white">{selectedReport.authorName}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedReport.severity)}`}>
                  {selectedReport.severity.toUpperCase()}
                </span>
              </div>
              
              <p className="text-gray-300">{selectedReport.content}</p>
              
              {/* Comments section would go here */}
              <div className="border-t border-dark-mauve/30 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Comments ({selectedReport.comments.length})
                </h4>
                
                {selectedReport.comments.map((comment) => (
                  <div key={comment.id} className="bg-black/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-white">{comment.authorName}</span>
                      <span className="text-gray-400 text-sm">
                        {formatTimeAgo(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                ))}
                
                {isConnected && (
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 input-field"
                    />
                    <button className="btn-primary">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};