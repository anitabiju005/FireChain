import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FireMap } from './components/FireMap';
import { IncidentsList } from './components/IncidentsList';
import { CommunityReports } from './components/CommunityReports';
import { SatelliteNetwork } from './components/SatelliteNetwork';
import { AIModels } from './components/AIModels';
import { CarbonExchange } from './components/CarbonExchange';
import { ContractInteraction } from './components/ContractInteraction';
import { WalletProvider } from './contexts/WalletContext';
import { NotificationProvider } from './contexts/NotificationContext';

type TabType = 'dashboard' | 'map' | 'incidents' | 'reports' | 'satellite' | 'ai' | 'carbon' | 'contracts';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [incidents, setIncidents] = useState([]);

  const handleIncidentReported = (incidentId: number) => {
    // Refresh incidents list when new incident is reported
    console.log('New incident reported:', incidentId);
    // You can add logic here to refresh the incidents list
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'map':
        return <FireMap incidents={incidents} />;
      case 'incidents':
        return <IncidentsList />;
      case 'reports':
        return <CommunityReports />;
      case 'satellite':
        return <SatelliteNetwork />;
      case 'ai':
        return <AIModels />;
      case 'carbon':
        return <CarbonExchange />;
      case 'contracts':
        return <ContractInteraction onIncidentReported={handleIncidentReported} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <WalletProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-jet-black">
          <Header activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="container mx-auto px-4 py-8">
            <div className="animate-fade-in">
              {renderActiveTab()}
            </div>
          </main>

          {/* Background decoration */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dark-mauve/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-soft-gold/5 rounded-full blur-3xl"></div>
            <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-fire-red/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </NotificationProvider>
    </WalletProvider>
  );
}

export default App;