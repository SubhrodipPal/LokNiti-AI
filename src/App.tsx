import { useState } from 'react';
import { 
  initialSystemWeights,
  type CitizenRequest,
  type IssueCluster,
  type SystemWeights,
  type ActionLogItem,
  constituencyPresets
} from './db/mockDb';
import { CitizenView } from './components/CitizenView';
import { MPDashboard } from './components/MPDashboard';
import { OfficerDashboard } from './components/OfficerDashboard';
import { AdminConsole } from './components/AdminConsole';
import { Sparkles, Users, User, Shield, Sliders } from 'lucide-react';
import { useEffect } from 'react';
import './App.css';

function App() {
  const [activeRole, setActiveRole] = useState<'citizen' | 'mp' | 'officer' | 'admin'>('mp');
  
  // Constituency Selection State
  const [currentConstituency, setCurrentConstituency] = useState<string>('kolkata_uttar');

  // Database States initialized from presets
  const [villages, setVillages] = useState(constituencyPresets['kolkata_uttar'].villages);
  const [requests, setRequests] = useState(constituencyPresets['kolkata_uttar'].requests);
  const [clusters, setClusters] = useState(constituencyPresets['kolkata_uttar'].clusters);
  const [weights, setWeights] = useState(initialSystemWeights);
  
  // Action History Log State
  const [actionHistory, setActionHistory] = useState<ActionLogItem[]>([]);
  
  // Budget & Projects counter states
  const [budgetAllocated, setBudgetAllocated] = useState(constituencyPresets['kolkata_uttar'].stats.budgetAllocated);
  const [budgetRemaining, setBudgetRemaining] = useState(constituencyPresets['kolkata_uttar'].stats.budgetAllocated - constituencyPresets['kolkata_uttar'].stats.budgetSpent);
  const [activeProjects, setActiveProjects] = useState(constituencyPresets['kolkata_uttar'].stats.activeProjects);
  const [completedProjects, setCompletedProjects] = useState(constituencyPresets['kolkata_uttar'].stats.completedProjects);

  // Sync state when constituency switches
  useEffect(() => {
    const preset = constituencyPresets[currentConstituency];
    if (preset) {
      setVillages(preset.villages);
      setRequests(preset.requests);
      setClusters(preset.clusters);
      setBudgetAllocated(preset.stats.budgetAllocated);
      setBudgetRemaining(preset.stats.budgetAllocated - preset.stats.budgetSpent);
      setActiveProjects(preset.stats.activeProjects);
      setCompletedProjects(preset.stats.completedProjects);
      setActionHistory([]); // Reset action history log
    }
  }, [currentConstituency]);

  // Logging core helper
  const logAction = (
    actor: ActionLogItem['actor'],
    actionType: ActionLogItem['actionType'],
    targetId: string,
    details: string,
    revertData?: any
  ) => {
    const newItem: ActionLogItem = {
      id: `ACT-${String(actionHistory.length + 1).padStart(3, '0')}-${Math.round(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor,
      actionType,
      targetId,
      details,
      revertData
    };
    setActionHistory(prev => [newItem, ...prev]);
  };

  // MP sets total budget and auto-distributes
  const handleUpdateTotalBudget = (newTotalLakhs: number) => {
    const previousAllocated = budgetAllocated;
    const difference = newTotalLakhs - budgetAllocated;
    setBudgetAllocated(newTotalLakhs);
    setBudgetRemaining(prev => Math.max(0, prev + difference));
    logAction('MP / Minister', 'UpdateBudget', 'BUDGET', `Adjusted total MPLADS budget to ₹${(newTotalLakhs / 100).toFixed(2)} Crore (previously ₹${(previousAllocated / 100).toFixed(2)} Crore)`, { previousAllocated });
  };

  // Revert/Undo dispatcher
  const handleUndoAction = (actionId: string) => {
    const action = actionHistory.find(a => a.id === actionId);
    if (!action) return;

    if (action.actionType === 'Approve') {
      const clusterId = action.targetId;
      const { cost } = action.revertData;
      setClusters(prev => prev.map(c => {
        if (c.id === clusterId) return { ...c, status: 'Recommended' };
        return c;
      }));
      setRequests(prev => prev.map(r => r.clusterId === clusterId ? { ...r, status: 'AI Verified' } : r));
      setBudgetRemaining(prev => prev + cost);
      setActiveProjects(prev => Math.max(0, prev - 1));
    } 
    else if (action.actionType === 'ProgressStatus') {
      const clusterId = action.targetId;
      const { previousStatus, newStatus } = action.revertData;
      setClusters(prev => prev.map(c => {
        if (c.id === clusterId) return { ...c, status: previousStatus };
        return c;
      }));
      setRequests(prev => prev.map(r => r.clusterId === clusterId ? { ...r, status: previousStatus } : r));
      
      if (newStatus === 'Completed') {
        setCompletedProjects(prev => Math.max(0, prev - 1));
        if (previousStatus === 'In Progress' || previousStatus === 'Approved') {
          setActiveProjects(prev => prev + 1);
        }
      } else if (newStatus === 'In Progress') {
        setActiveProjects(prev => Math.max(0, prev - 1));
      }
    } 
    else if (action.actionType === 'UpdateBudget') {
      const { previousAllocated } = action.revertData;
      const difference = previousAllocated - budgetAllocated;
      setBudgetAllocated(previousAllocated);
      setBudgetRemaining(prev => Math.max(0, prev + difference));
    }

    // Remove action from log
    setActionHistory(prev => prev.filter(a => a.id !== actionId));
  };

  // Add new request and dynamically link to cluster
  const handleAddRequest = (newReq: CitizenRequest) => {
    setRequests(prev => [newReq, ...prev]);
    
    // Check if there is an existing cluster for this category & village
    const existingCluster = clusters.find(
      c => c.category === newReq.category && c.locationId === newReq.locationId
    );

    if (existingCluster) {
      // Link to existing cluster
      setClusters(prev => prev.map(c => {
        if (c.id === existingCluster.id) {
          const updatedRequestIds = [...c.requestIds, newReq.id];
          return {
            ...c,
            requestIds: updatedRequestIds,
            // Slightly increment demand reasoning score representing new density
            reasoningBreakdown: {
              ...c.reasoningBreakdown,
              demandScore: Math.min(25, c.reasoningBreakdown.demandScore + 1)
            }
          };
        }
        return c;
      }));
    } else {
      // Create a brand new single-issue cluster
      const newClusterId = `CL-${String(clusters.length + 1).padStart(3, '0')}`;
      const newCluster: IssueCluster = {
        id: newClusterId,
        title: `Community ${newReq.category} Proposal at ${villages.find(v => v.id === newReq.locationId)?.name}`,
        category: newReq.category,
        locationId: newReq.locationId,
        requestIds: [newReq.id],
        priorityScore: Math.round(newReq.urgency * 100),
        status: 'Recommended',
        estimatedCost: newReq.category === 'Roads' ? 45 : newReq.category === 'Water' ? 25 : 15,
        beneficiaries: villages.find(v => v.id === newReq.locationId)?.population || 1000,
        impactMetric: `Directly addresses citizen grievance regarding ${newReq.subCategory.toLowerCase()}.`,
        reasoningBreakdown: {
          demandScore: 12,
          infraGapScore: 15,
          distanceScore: 12,
          densityScore: 5,
          vulnerableScore: 8,
          growthScore: 6,
          alignmentScore: 3,
          costScore: 9
        }
      };
      
      setClusters(prev => [...prev, newCluster]);
      
      // Update newReq with cluster ID link
      setRequests(prev => prev.map(r => r.id === newReq.id ? { ...r, clusterId: newClusterId } : r));
    }
  };

  // Upvote/Downvote grievance to update consensus density
  const handleVoteRequest = (id: string, type: 'support' | 'oppose') => {
    setRequests(prev => prev.map(r => {
      if (r.id === id) {
        const updated = {
          ...r,
          supportVotes: type === 'support' ? r.supportVotes + 1 : r.supportVotes,
          opposeVotes: type === 'oppose' ? r.opposeVotes + 1 : r.opposeVotes,
        };

        // If support votes change, propagate back to update cluster priority
        if (type === 'support' && r.clusterId) {
          setClusters(cPrev => cPrev.map(c => {
            if (c.id === r.clusterId) {
              return {
                ...c,
                reasoningBreakdown: {
                  ...c.reasoningBreakdown,
                  demandScore: Math.min(25, c.reasoningBreakdown.demandScore + 0.2) // small incremental boost
                }
              };
            }
            return c;
          }));
        }
        return updated;
      }
      return r;
    }));
  };

  // MP sanctions cluster
  const handleApproveCluster = (clusterId: string, cost: number) => {
    setClusters(prev => prev.map(c => {
      if (c.id === clusterId) {
        return { ...c, status: 'Approved' };
      }
      return c;
    }));

    // Deduct cost and update active count
    setBudgetRemaining(prev => Math.max(0, prev - cost));
    setActiveProjects(prev => prev + 1);

    // Update matching requests status to Approved
    setRequests(prev => prev.map(r => r.clusterId === clusterId ? { ...r, status: 'Approved' } : r));

    // Log action with revertData
    const clusterTitle = clusters.find(c => c.id === clusterId)?.title || clusterId;
    logAction('MP / Minister', 'Approve', clusterId, `Sanctioned and approved project "${clusterTitle}" (Cost: ₹${(cost/100).toFixed(2)} Cr)`, { cost });
  };

  // Officer updates project execution stage
  const handleUpdateClusterStatus = (clusterId: string, newStatus: IssueCluster['status']) => {
    const previousStatus = clusters.find(c => c.id === clusterId)?.status || 'Recommended';
    
    setClusters(prev => prev.map(c => {
      if (c.id === clusterId) {
        return { ...c, status: newStatus };
      }
      return c;
    }));

    // Update requests statuses
    setRequests(prev => prev.map(r => r.clusterId === clusterId ? { ...r, status: newStatus } : r));

    if (newStatus === 'Completed') {
      setActiveProjects(prev => Math.max(0, prev - 1));
      setCompletedProjects(prev => prev + 1);
    } else if (newStatus === 'In Progress' && previousStatus === 'Approved') {
      // Transitioning from Approved to In Progress
      // activeProjects count is already incremented during approval, so no change in activeProjects count.
    }

    // Log action
    const clusterTitle = clusters.find(c => c.id === clusterId)?.title || clusterId;
    logAction('District Officer', 'ProgressStatus', clusterId, `Progressed project "${clusterTitle}" status to [${newStatus}]`, { previousStatus, newStatus });
  };

  // Admin tunes prioritisation weights
  const handleUpdateWeights = (newWeights: SystemWeights) => {
    setWeights(newWeights);
  };

  return (
    <div className="lokniti-app">
      {/* Top Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-badge">LN</div>
          <div className="logo-text">
            <h1>LokNiti AI</h1>
            <p>Constituency Intelligence OS</p>
          </div>
        </div>

        {/* Global Dashboard Navigation Selector */}
        <nav className="role-nav">
          <button 
            className={`role-btn ${activeRole === 'citizen' ? 'active' : ''}`}
            onClick={() => setActiveRole('citizen')}
          >
            <Users size={16} /> Citizen Portal
          </button>
          <button 
            className={`role-btn ${activeRole === 'mp' ? 'active' : ''}`}
            onClick={() => setActiveRole('mp')}
          >
            <User size={16} /> MP Dashboard
          </button>
          <button 
            className={`role-btn ${activeRole === 'officer' ? 'active' : ''}`}
            onClick={() => setActiveRole('officer')}
          >
            <Shield size={16} /> Officer Portal
          </button>
          <button 
            className={`role-btn ${activeRole === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveRole('admin')}
          >
            <Sliders size={16} /> Admin Console
          </button>
        </nav>

        {/* Top-Right Constituency Selector */}
        <div className="dashboard-stats" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="stat-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={12} className="text-cyan" /> Active WB Constituency
            </span>
            <select 
              value={currentConstituency}
              onChange={(e) => setCurrentConstituency(e.target.value)}
              style={{ 
                background: 'rgba(0, 0, 0, 0.4)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '0.5rem', 
                color: '#fff', 
                padding: '0.35rem 0.5rem', 
                outline: 'none', 
                fontSize: '0.85rem', 
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <option value="kolkata_uttar">Kolkata Uttar (Urban City)</option>
              <option value="purulia">Purulia (Semi-Arid Rural)</option>
              <option value="darjeeling">Darjeeling (Hilly Slopes)</option>
              <option value="sundarbans">Sundarbans (Coastal Delta)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Core View Area */}
      <main className="main-content">
        {activeRole === 'citizen' && (
          <CitizenView 
            requests={requests} 
            villages={villages}
            onAddRequest={handleAddRequest}
            onVoteRequest={handleVoteRequest}
          />
        )}
        
        {activeRole === 'mp' && (
          <MPDashboard 
            clusters={clusters}
            villages={villages}
            weights={weights}
            budgetAllocated={budgetAllocated}
            budgetRemaining={budgetRemaining}
            activeProjects={activeProjects}
            completedProjects={completedProjects}
            onApproveCluster={handleApproveCluster}
            actionHistory={actionHistory}
            onUndoAction={handleUndoAction}
            onUpdateTotalBudget={handleUpdateTotalBudget}
          />
        )}

        {activeRole === 'officer' && (
          <OfficerDashboard 
            clusters={clusters}
            villages={villages}
            onUpdateClusterStatus={handleUpdateClusterStatus}
            actionHistory={actionHistory}
            onUndoAction={handleUndoAction}
          />
        )}

        {activeRole === 'admin' && (
          <AdminConsole 
            weights={weights}
            onUpdateWeights={handleUpdateWeights}
          />
        )}
      </main>
    </div>
  );
}

export default App;
