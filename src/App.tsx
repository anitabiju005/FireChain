@@ .. @@
 import { Header } from './components/Header';
 import { StatsCards } from './components/StatsCards';
 import { IncidentsList } from './components/IncidentsList';
-import { ReportForm } from './components/ReportForm';
 import { MapView } from './components/MapView';
+import { ContractInteraction } from './components/ContractInteraction';
 import { mockIncidents } from './data/mockData';
 import { FireIncident } from './types';
 
@@ .. @@
   const [incidents, setIncidents] = useState<FireIncident[]>(mockIncidents);
   const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'map'>('dashboard');
+  const [refreshTrigger, setRefreshTrigger] = useState(0);
 
   const handleNewReport = (newIncident: Omit<FireIncident, 'id' | 'timestamp' | 'status'>) => {
@@ .. @@
     setIncidents([...incidents, incident]);
   };
 
+  const handleIncidentReported = (incidentId: number) => {
+    // Trigger refresh of data
+    setRefreshTrigger(prev => prev + 1);
+    // Switch to dashboard to see the new incident
+    setActiveTab('dashboard');
+  };
+
   return (
@@ .. @@
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <div className="flex flex-col lg:flex-row gap-8">
             <div className="lg:w-2/3">
               {activeTab === 'dashboard' && (
                 <div className="space-y-6">
                   <StatsCards incidents={incidents} />
-                  <IncidentsList incidents={incidents} />
+                  <IncidentsList incidents={incidents} key={refreshTrigger} />
                 </div>
               )}
               
               {activeTab === 'report' && (
-                <ReportForm onSubmit={handleNewReport} />
+                <ContractInteraction onIncidentReported={handleIncidentReported} />
               )}
               
               {activeTab === 'map' && (
-                <MapView incidents={incidents} />
+                <MapView incidents={incidents} key={refreshTrigger} />
               )}
             </div>
             
             <div className="lg:w-1/3">
-              <MapView incidents={incidents} />
+              <MapView incidents={incidents} key={refreshTrigger} />
             </div>
           </div>
         </div>