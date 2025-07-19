import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { blockchainService } from '../services/blockchain';
import { useWallet } from '../hooks/useWallet';

interface ContractInteractionProps {
  onIncidentReported?: (incidentId: number) => void;
}

export const ContractInteraction: React.FC<ContractInteractionProps> = ({ onIncidentReported }) => {
  const { address, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [lastTransaction, setLastTransaction] = useState<string>('');

  // Form states
  const [reportForm, setReportForm] = useState({
    location: '',
    description: '',
    latitude: 0,
    longitude: 0,
    severity: 1
  });

  const [verifyForm, setVerifyForm] = useState({
    incidentId: 0,
    status: 1
  });

  const [fundForm, setFundForm] = useState({
    incidentId: 0,
    amount: '',
    justification: ''
  });

  useEffect(() => {
    if (isConnected && address) {
      loadData();
    }
  }, [isConnected, address]);

  const loadData = async () => {
    try {
      if (!address) return;
      
      const [balance, total] = await Promise.all([
        blockchainService.getTokenBalance(address),
        blockchainService.getTotalIncidents()
      ]);
      
      setTokenBalance(balance);
      setTotalIncidents(total);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleReportIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    setLoading(true);
    try {
      const result = await blockchainService.reportIncident(
        reportForm.location,
        reportForm.description,
        reportForm.latitude,
        reportForm.longitude,
        reportForm.severity
      );

      setLastTransaction(result.transactionHash);
      if (result.incidentId && onIncidentReported) {
        onIncidentReported(result.incidentId);
      }
      
      // Reset form
      setReportForm({
        location: '',
        description: '',
        latitude: 0,
        longitude: 0,
        severity: 1
      });
      
      // Reload data
      await loadData();
      
    } catch (error: any) {
      console.error('Error reporting incident:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    setLoading(true);
    try {
      const txHash = await blockchainService.verifyIncident(
        verifyForm.incidentId,
        verifyForm.status
      );

      setLastTransaction(txHash);
      await loadData();
      
    } catch (error: any) {
      console.error('Error verifying incident:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    setLoading(true);
    try {
      const result = await blockchainService.requestEmergencyFunds(
        fundForm.incidentId,
        fundForm.amount,
        fundForm.justification
      );

      setLastTransaction(result.transactionHash);
      
      // Reset form
      setFundForm({
        incidentId: 0,
        amount: '',
        justification: ''
      });
      
    } catch (error: any) {
      console.error('Error requesting funds:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-[#0A0A0A] border border-[#6B4C7E]/30 rounded-xl p-6">
        <div className="text-center">
          <Shield className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Connect Wallet</h3>
          <p className="text-gray-400">Connect your MetaMask wallet to interact with smart contracts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A0A0A] border border-[#6B4C7E]/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-[#D4AF37]" />
            <div>
              <p className="text-sm text-gray-400">FCT Balance</p>
              <p className="text-xl font-bold text-white">{parseFloat(tokenBalance).toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0A0A0A] border border-[#6B4C7E]/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-[#D4AF37]" />
            <div>
              <p className="text-sm text-gray-400">Total Incidents</p>
              <p className="text-xl font-bold text-white">{totalIncidents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0A0A0A] border border-[#6B4C7E]/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
            <div>
              <p className="text-sm text-gray-400">Network</p>
              <p className="text-xl font-bold text-white">Mumbai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Incident Form */}
      <div className="bg-[#0A0A0A] border border-[#6B4C7E]/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <AlertTriangle className="w-6 h-6 text-[#D4AF37] mr-2" />
          Report Fire Incident
        </h3>
        
        <form onSubmit={handleReportIncident} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={reportForm.location}
                onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-[#6B4C7E]/30 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                placeholder="e.g., Yellowstone National Park"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
              <select
                value={reportForm.severity}
                onChange={(e) => setReportForm({ ...reportForm, severity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-black/50 border border-[#6B4C7E]/30 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value={0}>Low</option>
                <option value={1}>Medium</option>
                <option value={2}>High</option>
                <option value={3}>Critical</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Latitude</label>
              <input
                type="number"
                step="any"
                value={reportForm.latitude}
                onChange={(e) => setReportForm({ ...reportForm, latitude: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-black/50 border border-[#6B4C7E]/30 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                placeholder="e.g., 44.4280"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Longitude</label>
              <input
                type="number"
                step="any"
                value={reportForm.longitude}
                onChange={(e) => setReportForm({ ...reportForm, longitude: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-black/50 border border-[#6B4C7E]/30 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                placeholder="e.g., -110.5885"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={reportForm.description}
              onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-[#6B4C7E]/30 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
              rows={3}
              placeholder="Describe the fire incident..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B4C7E] hover:bg-[#6B4C7E]/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Reporting...' : 'Report Incident'}
          </button>
        </form>
      </div>

      {/* Verify Incident Form */}
      <div className="bg-[#0A0A0A] border border-[#6B4C7E]/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 text-[#D4AF37] mr-2" />
          Verify Incident
        </h3>
        
        <form onSubmit={handleVerifyIncident} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Incident ID</label>
              <input
                type="number"
                value={verifyForm.incidentId}
                onChange={(e) => setVerifyForm({ ...verifyForm, incidentId: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-black/50 border border-[#6B4C7E]/30 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                placeholder="e.g., 1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={verifyForm.status}
                onChange={(e) => setVerifyForm({ ...verifyForm, status: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-black/50 border border-[#6B4C7E]/30 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value={1}>Verified</option>
                <option value={2}>Resolved</option>
                <option value={3}>False Report</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B4C7E] hover:bg-[#6B4C7E]/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Incident'}
          </button>
        </form>
      </div>

      {/* Request Emergency Funds */}
      <div className="bg-[#0A0A0A] border border-[#6B4C7E]/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <DollarSign className="w-6 h-6 text-[#D4AF37] mr-2" />
          Request Emergency Funds
        </h3>
        
        <form onSubmit={handleRequestFunds} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Incident ID</label>
              <input
                type="number"
                value={fundForm.incidentId}
                onChange={(e) => setFundForm({ ...fundForm, incidentId: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-black/50 border border-[#6B4C7E]/30 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                placeholder="e.g., 1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount (ETH)</label>
              <input
                type="number"
                step="0.01"
                value={fundForm.amount}
                onChange={(e) => setFundForm({ ...fundForm, amount: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-[#6B4C7E]/30 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                placeholder="e.g., 1.5"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Justification</label>
            <textarea
              value={fundForm.justification}
              onChange={(e) => setFundForm({ ...fundForm, justification: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-[#6B4C7E]/30 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
              rows={3}
              placeholder="Explain why emergency funds are needed..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B4C7E] hover:bg-[#6B4C7E]/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Requesting...' : 'Request Funds'}
          </button>
        </form>
      </div>

      {/* Last Transaction */}
      {lastTransaction && (
        <div className="bg-[#0A0A0A] border border-[#6B4C7E]/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <p className="text-sm text-gray-400">Last Transaction</p>
              <p className="text-sm font-mono text-white break-all">{lastTransaction}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};