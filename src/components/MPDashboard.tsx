import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Coins, Activity, Sparkles, MapPin, 
  Sliders, Layers, CheckCircle2, Undo2, 
  Settings, RefreshCw, AlertCircle, School, 
  HeartPulse, Droplet, ZoomIn, ZoomOut
} from 'lucide-react';
import { type IssueCluster, type Village, type SystemWeights, type ActionLogItem, calculatePriority, formatIndianCurrency } from '../db/mockDb';

interface MPDashboardProps {
  clusters: IssueCluster[];
  villages: Village[];
  weights: SystemWeights;
  budgetAllocated: number;
  budgetRemaining: number;
  activeProjects: number;
  completedProjects: number;
  onApproveCluster: (id: string, cost: number) => void;
  actionHistory: ActionLogItem[];
  onUndoAction: (id: string) => void;
  onUpdateTotalBudget: (newTotalLakhs: number) => void;
}

export const MPDashboard: React.FC<MPDashboardProps> = ({
  clusters,
  villages,
  weights,
  budgetAllocated,
  budgetRemaining,
  activeProjects,
  completedProjects,
  onApproveCluster,
  actionHistory,
  onUndoAction,
  onUpdateTotalBudget
}) => {
  const [selectedVillageId, setSelectedVillageId] = useState<string>('AS1');
  const [selectedClusterId, setSelectedClusterId] = useState<string>('CL-001');
  const [mapLayer, setMapLayer] = useState<'default' | 'heatmap' | 'roads' | 'water' | 'schools'>('default');
  const [isZoomedIn, setIsZoomedIn] = useState<boolean>(false);

  // Auto-zoom out if villages list changes (constituency switch)
  useEffect(() => {
    setIsZoomedIn(false);
  }, [villages]);

  const [selectedWardIndex, setSelectedWardIndex] = useState<number | null>(null);

  // Reset selected ward when selected village changes
  useEffect(() => {
    setSelectedWardIndex(null);
  }, [selectedVillageId]);

  // Digital Twin Simulator States
  const [simRoadsBudget, setSimRoadsBudget] = useState(25);      // percentage
  const [simWaterBudget, setSimWaterBudget] = useState(30);      // percentage
  const [simEducationBudget, setSimEducationBudget] = useState(25);  // percentage
  const [simHealthBudget, setSimHealthBudget] = useState(20);     // percentage

  // Local states for budget planning
  const [inputBudget, setInputBudget] = useState<number>(budgetAllocated / 100);
  const [distributeMode, setDistributeMode] = useState<'need' | 'population'>('need');

  // Sync if budgetAllocated changes (e.g., undo action)
  useEffect(() => {
    setInputBudget(budgetAllocated / 100);
  }, [budgetAllocated]);

  // Recalculated prioritize list based on weights
  const [rankedClusters, setRankedClusters] = useState<IssueCluster[]>([]);

  useEffect(() => {
    // Re-evaluate priority scores whenever clusters or weights change
    const updated = clusters.map(c => ({
      ...c,
      priorityScore: calculatePriority(c, weights, villages)
    }));
    // Sort by priorityScore desc
    updated.sort((a, b) => b.priorityScore - a.priorityScore);
    setRankedClusters(updated);
  }, [clusters, weights, villages]);

  const getMicroWards = (segmentId: string) => {
    if (segmentId === 'AS1') {
      return [
        { name: 'Ward 1 (Kashipur Road)', x: 140, y: 150, type: 'roads', status: 'Poor', asset: 'Sewer Line Siltation', hasGrievance: true },
        { name: 'Ward 2 (Belgachhia Railway Colony)', x: 340, y: 140, type: 'schools', status: 'Deficient', asset: 'Primary School Structure', hasGrievance: true },
        { name: 'Ward 3 (Cossipore Ghat)', x: 180, y: 310, type: 'water', status: 'Adequate', asset: 'Drinking Water Fountain', hasGrievance: false },
        { name: 'Ward 5 (Tala Tank Area)', x: 320, y: 300, type: 'water', status: 'Scarce', asset: 'Tala Reservoir Feed', hasGrievance: true }
      ];
    }
    if (segmentId === 'AS4') {
      return [
        { name: 'Ward 39 (Madan Chatterjee Lane)', x: 150, y: 130, type: 'water', status: 'Scarce', asset: 'Rusty Water Outflow', hasGrievance: true },
        { name: 'Ward 40 (MG Road Cross)', x: 330, y: 160, type: 'roads', status: 'Good', asset: 'Traffic Transit Node', hasGrievance: false },
        { name: 'Burrabazar Market Wards', x: 220, y: 310, type: 'roads', status: 'Poor', asset: 'Fire Hydrant Deficiency', hasGrievance: true }
      ];
    }
    if (segmentId === 'AS5') {
      return [
        { name: 'Ward 33 (Beleghata Main Rd)', x: 130, y: 160, type: 'roads', status: 'Poor', asset: 'Clogged Drainage Canal', hasGrievance: true },
        { name: 'Ward 34 (Subhas Sarobar West)', x: 350, y: 150, type: 'health', status: 'Deficient', asset: 'Pediatric Doctor Vacancy', hasGrievance: true },
        { name: 'Ward 35 (Phoolbagan)', x: 250, y: 320, type: 'water', status: 'Adequate', asset: 'Deep Tube-well Kiosk', hasGrievance: false }
      ];
    }
    if (segmentId === 'AS7') {
      return [
        { name: 'Ward 54 (Convent Road)', x: 160, y: 140, type: 'schools', status: 'Deficient', asset: 'Primary School Leaking Roof', hasGrievance: true },
        { name: 'Ward 55 (Entally Market)', x: 350, y: 160, type: 'roads', status: 'Fair', asset: 'Market Access Road', hasGrievance: false },
        { name: 'Ward 56 (Ananda Palit)', x: 250, y: 310, type: 'water', status: 'Adequate', asset: 'Filtered Tap Water Stand', hasGrievance: false }
      ];
    }
    return [
      { name: 'North Sector Ward', x: 150, y: 140, type: 'water', status: 'Scarce', asset: 'Water Supply Tap', hasGrievance: true },
      { name: 'Central Sector Ward', x: 330, y: 160, type: 'roads', status: 'Poor', asset: 'Silt Drainage Outlet', hasGrievance: true },
      { name: 'South Sector Ward', x: 240, y: 310, type: 'schools', status: 'Deficient', asset: 'School Classrooms', hasGrievance: true }
    ];
  };

  const microWards = getMicroWards(selectedVillageId);

  const selectedVillage = villages.find(v => v.id === selectedVillageId) || villages[0];
  const selectedCluster = rankedClusters.find(c => c.id === selectedClusterId) || rankedClusters[0];

  // Simulator Outcome Calculations
  const totalSimPercent = simRoadsBudget + simWaterBudget + simEducationBudget + simHealthBudget;

  const simOutcomes = {
    travelReduction: Math.min(60, Math.round(simRoadsBudget * 1.8)),
    waterAccessCover: Math.min(95, Math.round(50 + simWaterBudget * 1.3)),
    literacyIncrease: (simEducationBudget * 0.3).toFixed(1),
    phcCoverage: Math.min(98, Math.round(40 + simHealthBudget * 2.2))
  };

  const handleVillageClick = (id: string) => {
    setSelectedVillageId(id);
    // Find clusters associated with this village and select the first one if exists
    const associated = clusters.find(c => c.locationId === id);
    if (associated) setSelectedClusterId(associated.id);
  };

  // Helper to color nodes based on layers
  const getNodeColor = (village: Village) => {
    if (mapLayer === 'heatmap') {
      const pendingCount = clusters.filter(c => c.locationId === village.id && c.status === 'Recommended').length;
      if (pendingCount >= 2) return 'var(--accent-rose)';
      if (pendingCount === 1) return 'var(--accent-amber)';
      return 'var(--accent-emerald)';
    }
    if (mapLayer === 'roads') {
      return village.infrastructure.roads === 'Poor' ? 'var(--accent-rose)' : village.infrastructure.roads === 'Fair' ? 'var(--accent-amber)' : 'var(--accent-emerald)';
    }
    if (mapLayer === 'water') {
      return village.infrastructure.waterAccess === 'Scarce' ? 'var(--accent-rose)' : 'var(--accent-emerald)';
    }
    if (mapLayer === 'schools') {
      return village.infrastructure.schools === 'Deficient' ? 'var(--accent-rose)' : 'var(--accent-emerald)';
    }
    // Default development index color
    if (village.developmentIndex < 60) return 'var(--accent-rose)';
    if (village.developmentIndex < 75) return 'var(--accent-amber)';
    return 'var(--accent-emerald)';
  };

  return (
    <div className="mp-dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', padding: '0.75rem', borderRadius: '0.75rem' }}>
            <Coins size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Remaining MPLADS Budget</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              {formatIndianCurrency(budgetRemaining)}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Of {formatIndianCurrency(budgetAllocated)} allocated</span>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', padding: '0.75rem', borderRadius: '0.75rem' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Constituency Health Score</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent-emerald)' }}>
              92%
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+4% improvement over Q1</span>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', padding: '0.75rem', borderRadius: '0.75rem' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active Project Pipelines</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              {activeProjects} Active
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{completedProjects} projects completed</span>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', padding: '0.75rem', borderRadius: '0.75rem' }}>
            <Activity size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Critical Demand Clusters</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent-rose)' }}>
              {rankedClusters.filter(c => c.status === 'Recommended').length} Queued
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ranked by AI evidence matching</span>
          </div>
        </div>

      </div>

      {/* NEW: Master Budget Planner & Action Ledger Undo Center */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '0.5rem' }}>
        
        {/* Card 1: Budget Planner & AI Allocation */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            <h2 className="glass-card-title" style={{ border: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={20} className="text-cyan" /> MPLADS Master Budget Planner
            </h2>
            <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
              <button 
                onClick={() => setDistributeMode('need')}
                style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: 'none', background: distributeMode === 'need' ? 'var(--accent-cyan)' : 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                By Need (AI)
              </button>
              <button 
                onClick={() => setDistributeMode('population')}
                style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: 'none', background: distributeMode === 'population' ? 'var(--accent-cyan)' : 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                By Population
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total MPLADS Budget Allocation (₹ Crore)</label>
              <input 
                type="number" 
                value={inputBudget}
                onChange={(e) => setInputBudget(parseFloat(e.target.value) || 0)}
                step="0.5"
                min="5"
                max="100"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: '#fff', padding: '0.5rem', outline: 'none', fontSize: '0.9rem', width: '100%' }}
              />
            </div>
            <button 
              onClick={() => onUpdateTotalBudget(Math.round(inputBudget * 100))}
              className="btn-primary"
              style={{ padding: '0.5rem 1rem', height: 'fit-content', alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <RefreshCw size={14} /> Update
            </button>
          </div>

          {/* Budget distribution list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: '180px', paddingRight: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Constituency Budget Share Distribution:</span>
            {(() => {
              const totalVal = villages.reduce((acc, v) => acc + (distributeMode === 'need' ? (100 - v.developmentIndex) : v.population), 0);
              return villages.map(v => {
                const itemVal = distributeMode === 'need' ? (100 - v.developmentIndex) : v.population;
                const ratio = totalVal ? (itemVal / totalVal) : 0;
                const shareLakhs = budgetAllocated * ratio;
                return (
                  <div key={v.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.4rem 0.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{v.name}</span>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                        {formatIndianCurrency(shareLakhs)} ({(ratio * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                      <div style={{ width: `${ratio * 100}%`, height: '100%', background: distributeMode === 'need' ? 'var(--accent-cyan)' : 'var(--accent-emerald)', borderRadius: '2px' }}></div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Card 2: Action Ledger & Undo Center */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h2 className="glass-card-title" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Undo2 size={20} className="text-cyan" /> Constituency Action Ledger & Undo Center
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: '250px', flex: 1, paddingRight: '0.25rem' }}>
            {actionHistory.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '1rem', textAlign: 'center' }}>
                No administrative actions logged in this session yet.
              </div>
            ) : (
              actionHistory.map(act => (
                <div 
                  key={act.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '0.5rem', 
                    padding: '0.6rem 0.75rem',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', maxWidth: '75%' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        padding: '0.15rem 0.4rem', 
                        borderRadius: '0.25rem', 
                        background: act.actor.includes('MP') ? 'rgba(6,182,212,0.15)' : 'rgba(245,158,11,0.15)',
                        color: act.actor.includes('MP') ? 'var(--accent-cyan)' : 'var(--accent-amber)',
                        fontWeight: 600
                      }}>
                        {act.actor}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{act.timestamp}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#fff', marginTop: '0.1rem' }}>{act.details}</div>
                  </div>
                  
                  {act.revertData && (
                    <button 
                      onClick={() => onUndoAction(act.id)}
                      className="btn-secondary"
                      style={{ 
                        fontSize: '0.7rem', 
                        padding: '0.3rem 0.6rem', 
                        borderRadius: '0.375rem', 
                        borderColor: 'rgba(244,63,94,0.3)', 
                        background: 'rgba(244,63,94,0.03)',
                        color: 'var(--accent-rose)',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        cursor: 'pointer' 
                      }}
                    >
                      <Undo2 size={12} /> Undo
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Main Grid: Map & Village details */}
      <div className="three-column-grid">
        
        {/* Interactive GIS Digital Twin Map */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            <h2 className="glass-card-title" style={{ border: 'none', margin: 0, padding: 0 }}>
              <Layers size={20} className="text-cyan" /> GIS Constituency Twin
            </h2>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {/* Map Zoom Action */}
              <button 
                onClick={() => setIsZoomedIn(!isZoomedIn)}
                className="btn-secondary" 
                style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderColor: isZoomedIn ? 'var(--accent-cyan)' : 'var(--glass-border)', background: isZoomedIn ? 'rgba(6, 182, 212, 0.05)' : 'transparent', cursor: 'pointer' }}
              >
                {isZoomedIn ? <ZoomOut size={12} /> : <ZoomIn size={12} />}
                {isZoomedIn ? 'Constituency View' : `Zoom to ${selectedVillage.name}`}
              </button>

              {/* Map Layers Switcher */}
              <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                <button 
                  onClick={() => setMapLayer('default')}
                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: 'none', background: mapLayer === 'default' ? 'var(--accent-cyan)' : 'transparent', color: '#fff', cursor: 'pointer' }}
                  disabled={isZoomedIn}
                >
                  Default
                </button>
                <button 
                  onClick={() => setMapLayer('heatmap')}
                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: 'none', background: mapLayer === 'heatmap' ? 'var(--accent-cyan)' : 'transparent', color: '#fff', cursor: 'pointer' }}
                  disabled={isZoomedIn}
                >
                  Demand Heatmap
                </button>
                <button 
                  onClick={() => setMapLayer('roads')}
                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: 'none', background: mapLayer === 'roads' ? 'var(--accent-cyan)' : 'transparent', color: '#fff', cursor: 'pointer' }}
                  disabled={isZoomedIn}
                >
                  Road Gaps
                </button>
                <button 
                  onClick={() => setMapLayer('water')}
                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: 'none', background: mapLayer === 'water' ? 'var(--accent-cyan)' : 'transparent', color: '#fff', cursor: 'pointer' }}
                  disabled={isZoomedIn}
                >
                  Water Scarcity
                </button>
              </div>
            </div>
          </div>

          <div className="map-canvas">
            <svg width="100%" height="100%" viewBox="0 0 500 450">
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

               {!isZoomedIn ? (
                <>
                  {/* Dynamic Geography background overlays based on current constituency */}
                  {villages.some(v => v.name.includes('Kashipur') || v.name.includes('Shyampukur')) && (
                    <>
                      {/* Hooghly River */}
                      <path d="M -10 180 C 100 220, 200 150, 320 220 C 400 260, 480 230, 520 270" fill="none" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="14" strokeLinecap="round" />
                      
                      {/* Kolkata Dotted grid overlays */}
                      <line x1="180" y1="120" x2="320" y2="100" className="connection-line" />
                      <line x1="180" y1="120" x2="120" y2="280" className="connection-line" />
                      <line x1="120" y1="280" x2="200" y2="380" className="connection-line" />
                      <line x1="250" y1="240" x2="320" y2="100" className="connection-line" />
                      <line x1="250" y1="240" x2="380" y2="290" className="connection-line" />
                      <line x1="380" y1="290" x2="200" y2="380" className="connection-line" />
                    </>
                  )}

                  {villages.some(v => v.name.includes('Purulia') || v.name.includes('Balarampur')) && (
                    <>
                      {/* Ayodhya Hills contours */}
                      <path d="M 50 380 L 170 180 L 290 380 Z" fill="rgba(245, 158, 11, 0.04)" stroke="rgba(245, 158, 11, 0.08)" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 200 420 L 320 200 L 440 420 Z" fill="rgba(245, 158, 11, 0.03)" stroke="rgba(245, 158, 11, 0.06)" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 100 440 L 200 280 L 300 440 Z" fill="rgba(245, 158, 11, 0.03)" stroke="rgba(245, 158, 11, 0.06)" strokeWidth="2" strokeLinecap="round" />
                      
                      {/* Connection lines */}
                      <line x1="240" y1="100" x2="160" y2="180" className="connection-line" />
                      <line x1="160" y1="180" x2="110" y2="240" className="connection-line" />
                      <line x1="110" y1="240" x2="100" y2="120" className="connection-line" />
                      <line x1="240" y1="100" x2="380" y2="110" className="connection-line" />
                      <line x1="380" y1="110" x2="360" y2="220" className="connection-line" />
                      <line x1="360" y1="220" x2="300" y2="320" className="connection-line" />
                      <line x1="300" y1="320" x2="160" y2="180" className="connection-line" />
                    </>
                  )}

                  {villages.some(v => v.name.includes('Darjeeling') || v.name.includes('Kurseong')) && (
                    <>
                      {/* Mountain Peak outlines with Snowcaps */}
                      <path d="M 80 400 L 220 120 L 360 400 Z" fill="rgba(14, 116, 144, 0.04)" stroke="rgba(14, 116, 144, 0.08)" strokeWidth="2" strokeLinecap="round" />
                      <polygon points="220,120 190,180 250,180" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                      
                      <path d="M 240 430 L 370 160 L 500 430 Z" fill="rgba(14, 116, 144, 0.03)" stroke="rgba(14, 116, 144, 0.06)" strokeWidth="2" strokeLinecap="round" />
                      <polygon points="370,160 340,220 400,220" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                      
                      {/* Connection lines */}
                      <line x1="200" y1="100" x2="240" y2="220" className="connection-line" />
                      <line x1="240" y1="220" x2="380" y2="120" className="connection-line" />
                      <line x1="200" y1="100" x2="100" y2="80" className="connection-line" />
                      <line x1="100" y1="80" x2="90" y2="180" className="connection-line" />
                      <line x1="90" y1="180" x2="120" y2="240" className="connection-line" />
                      <line x1="240" y1="220" x2="410" y2="280" className="connection-line" />
                    </>
                  )}

                  {villages.some(v => v.name.includes('Gosaba') || v.name.includes('Namkhana')) && (
                    <>
                      {/* Delta tidal river networks */}
                      <path d="M -10 120 C 120 140, 180 80, 270 190 C 350 290, 420 220, 520 280" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="14" strokeLinecap="round" />
                      <path d="M 180 -10 C 220 140, 140 240, 230 320 C 310 400, 260 460, 290 520" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="14" strokeLinecap="round" />
                      <path d="M 360 -10 C 340 100, 400 240, 360 360" fill="none" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="10" strokeLinecap="round" />
                      <path d="M 60 460 C 120 380, 280 410, 360 460" fill="none" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="10" strokeLinecap="round" />

                      {/* Island connection indicators */}
                      <line x1="280" y1="260" x2="330" y2="190" className="connection-line" />
                      <line x1="330" y1="190" x2="390" y2="110" className="connection-line" />
                      <line x1="390" y1="110" x2="410" y2="50" className="connection-line" />
                      <line x1="280" y1="260" x2="210" y2="390" className="connection-line" />
                      <line x1="210" y1="390" x2="160" y2="380" className="connection-line" />
                      <line x1="160" y1="380" x2="80" y2="360" className="connection-line" />
                    </>
                  )}

                  {/* Village Nodes */}
                  {villages.map(v => {
                    const nodeColor = getNodeColor(v);
                    const isSelected = v.id === selectedVillageId;
                    
                    return (
                      <g key={v.id} onClick={() => handleVillageClick(v.id)} className="village-node">
                        {isSelected && (
                          <circle cx={v.x} cy={v.y} r="20" fill="transparent" stroke={nodeColor} strokeWidth="1.5" style={{ transformOrigin: `${v.x}px ${v.y}px`, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                        )}
                        <circle cx={v.x} cy={v.y} r={isSelected ? 10 : 8} fill={nodeColor} stroke="#fff" strokeWidth={isSelected ? 2.5 : 1.5} />
                        <text x={v.x} y={v.y - 15} textAnchor="middle" fill={isSelected ? '#fff' : 'var(--text-secondary)'} fontSize={isSelected ? '11' : '10'} fontWeight={isSelected ? 700 : 500} fontFamily="var(--font-display)">
                          {v.name}
                        </text>
                        <text x={v.x} y={v.y + 22} textAnchor="middle" fill="var(--text-muted)" fontSize="8">
                          ({v.developmentIndex}%)
                        </text>
                      </g>
                    );
                  })}
                </>
              ) : (
                <>
                  {/* Detailed Micro Map Zoomed-In Overlay */}
                  <rect x="30" y="30" width="440" height="390" rx="12" fill="rgba(6, 182, 212, 0.01)" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1.5" strokeDasharray="5,5" />
                  
                  <text x="250" y="55" textAnchor="middle" fill="#fff" fontSize="14" fontWeight={700} letterSpacing="1" fontFamily="var(--font-display)">
                    LOCAL MICRO-GIS: {selectedVillage.name.toUpperCase()}
                  </text>
                  <text x="250" y="70" textAnchor="middle" fill="var(--text-muted)" fontSize="8">
                    Select a local asset node to view audit logs & indicators
                  </text>

                  {/* Render specialized geographical water or hill overlays if in Kolkata or Darjeeling */}
                  {villages.some(v => v.name.includes('Kashipur') || v.name.includes('Shyampukur')) && (
                    <path d="M 45 100 L 45 380" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="12" fill="none" />
                  )}
                  {villages.some(v => v.name.includes('Darjeeling') || v.name.includes('Kurseong')) && (
                    <path d="M 30 380 C 150 350, 300 370, 470 340" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeDasharray="2,4" fill="none" />
                  )}

                  {/* Intersecting local street map representation */}
                  <line x1="50" y1="200" x2="450" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="2" />
                  <line x1="250" y1="50" x2="250" y2="400" stroke="rgba(255,255,255,0.03)" strokeWidth="2" />
                  <line x1="100" y1="100" x2="400" y2="350" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" />

                  {/* Wards Nodes */}
                  {microWards.map((w, index) => {
                    const isWardSelected = index === selectedWardIndex;
                    let assetColor = 'var(--accent-emerald)';
                    if (w.status === 'Poor' || w.status === 'Scarce' || w.status === 'Deficient') assetColor = 'var(--accent-rose)';
                    else if (w.status === 'Fair') assetColor = 'var(--accent-amber)';

                    return (
                      <g key={w.name} onClick={() => setSelectedWardIndex(index)} className="village-node" style={{ cursor: 'pointer' }}>
                        {isWardSelected && (
                          <circle cx={w.x} cy={w.y} r="22" fill="transparent" stroke={assetColor} strokeWidth="1.5" style={{ transformOrigin: `${w.x}px ${w.y}px`, animation: 'ping 1.8s infinite' }} />
                        )}
                        {w.hasGrievance && (
                          <circle cx={w.x} cy={w.y} r="16" fill="transparent" stroke="var(--accent-rose)" strokeWidth="1" strokeDasharray="3,3" />
                        )}

                        <circle cx={w.x} cy={w.y} r={isWardSelected ? 12 : 10} fill="var(--bg-secondary)" stroke={assetColor} strokeWidth="2" />
                        
                        <foreignObject x={w.x - 8} y={w.y - 8} width="16" height="16" style={{ pointerEvents: 'none' }}>
                          <div style={{ color: assetColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {w.type === 'roads' && <MapPin size={10} />}
                            {w.type === 'schools' && <School size={10} />}
                            {w.type === 'water' && <Droplet size={10} />}
                            {w.type === 'health' && <HeartPulse size={10} />}
                          </div>
                        </foreignObject>

                        <text x={w.x} y={w.y - 18} textAnchor="middle" fill={isWardSelected ? '#fff' : 'var(--text-secondary)'} fontSize="9" fontWeight={isWardSelected ? 700 : 500}>
                          {w.name.split(' (')[0]}
                        </text>
                        <text x={w.x} y={w.y + 20} textAnchor="middle" fill="var(--text-muted)" fontSize="8">
                          {w.asset}
                        </text>

                        {w.hasGrievance && (
                          <foreignObject x={w.x + 8} y={w.y - 20} width="10" height="10">
                            <div style={{ color: 'var(--accent-rose)' }}><AlertCircle size={9} /></div>
                          </foreignObject>
                        )}
                      </g>
                    );
                  })}
                </>
              )}
            </svg>

            {/* Detailed Micro Map Ward Info Overlay */}
            {isZoomedIn && selectedWardIndex !== null && (
              <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid var(--accent-cyan)', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', padding: '0.4rem', borderRadius: '0.375rem' }}>
                    {microWards[selectedWardIndex].type === 'roads' && <MapPin size={16} />}
                    {microWards[selectedWardIndex].type === 'schools' && <School size={16} />}
                    {microWards[selectedWardIndex].type === 'water' && <Droplet size={16} />}
                    {microWards[selectedWardIndex].type === 'health' && <HeartPulse size={16} />}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Micro-GIS Asset Audit • {microWards[selectedWardIndex].type.toUpperCase()}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{microWards[selectedWardIndex].name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Asset: <strong style={{ color: '#fff' }}>{microWards[selectedWardIndex].asset}</strong> | Status: <strong style={{ color: microWards[selectedWardIndex].status === 'Poor' || microWards[selectedWardIndex].status === 'Scarce' || microWards[selectedWardIndex].status === 'Deficient' ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>{microWards[selectedWardIndex].status}</strong>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedWardIndex(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                >
                  Clear Selection
                </button>
              </div>
            )}

            {/* Map Legend */}
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(10, 15, 29, 0.85)', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-rose)' }}></span>
                <span>Critical Gap / Hotspot</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }}></span>
                <span>Moderate Gaps</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)' }}></span>
                <span>Satisfactory Level</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Village Info Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="glass-card-title">
            <MapPin size={20} className="text-cyan" /> Village Insights
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{selectedVillage.name}</span>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Primary Village Node: {selectedVillage.id}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 600, color: selectedVillage.developmentIndex < 60 ? 'var(--accent-rose)' : selectedVillage.developmentIndex < 75 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                  {selectedVillage.developmentIndex}%
                </span>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Dev Index</p>
              </div>
            </div>

            {/* Stats list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Village Population</span>
                <span style={{ fontWeight: 600 }}>{selectedVillage.population}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Literacy Ratio</span>
                <span style={{ fontWeight: 600 }}>{selectedVillage.demographics.literacy}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Vulnerable Demographic</span>
                <span style={{ fontWeight: 600 }}>{selectedVillage.demographics.vulnerableRatio}% (Youth/Senior)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Road Infrastructure</span>
                <span style={{ fontWeight: 600, color: selectedVillage.infrastructure.roads === 'Poor' ? 'var(--accent-rose)' : 'var(--text-primary)' }}>{selectedVillage.infrastructure.roads}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Water Resources</span>
                <span style={{ fontWeight: 600, color: selectedVillage.infrastructure.waterAccess === 'Scarce' ? 'var(--accent-rose)' : 'var(--text-primary)' }}>{selectedVillage.infrastructure.waterAccess === 'Scarce' ? 'Deficient' : 'Adequate'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Primary School Travel</span>
                <span style={{ fontWeight: 600, color: selectedVillage.infrastructure.schools === 'Deficient' ? 'var(--accent-rose)' : 'var(--text-primary)' }}>{selectedVillage.infrastructure.schools === 'Deficient' ? 'Deficient (>5km)' : 'Adequate'}</span>
              </div>
            </div>

            {/* Village Associated Pending Clusters */}
            <div style={{ marginTop: 'auto' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Pending proposals in this village:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {rankedClusters.filter(c => c.locationId === selectedVillage.id).map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setSelectedClusterId(c.id)}
                    className="btn-secondary" 
                    style={{ fontSize: '0.75rem', justifyContent: 'space-between', padding: '0.4rem 0.75rem', width: '100%', borderColor: c.id === selectedClusterId ? 'var(--accent-cyan)' : 'var(--glass-border)' }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{c.title}</span>
                    <span style={{ color: c.priorityScore >= 85 ? 'var(--accent-rose)' : 'var(--accent-amber)', fontWeight: 600 }}>★ {c.priorityScore}</span>
                  </button>
                ))}
                {rankedClusters.filter(c => c.locationId === selectedVillage.id).length === 0 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>No pending proposals.</div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Grid: AI Recommendations list & Selected Proposal details */}
      <div className="three-column-grid">
        
        {/* Ranked Cluster List */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="glass-card-title">
            <Sparkles size={20} className="text-cyan" /> Prioritized Development Proposals
          </h2>
          <div className="recommendation-list">
            {rankedClusters.map((c, index) => (
              <div 
                key={c.id}
                onClick={() => setSelectedClusterId(c.id)}
                className={`recommendation-card ${c.id === selectedClusterId ? 'selected' : ''}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxWidth: '75%' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Rank #{index + 1} | {villages.find(v => v.id === c.locationId)?.name}
                  </span>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{c.title}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                    Est. Cost: {formatIndianCurrency(c.estimatedCost)} | Status: {c.status}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className={`score-badge ${c.priorityScore >= 90 ? 'high' : c.priorityScore >= 80 ? 'medium' : 'low'}`}>
                    {c.priorityScore}
                  </div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Score</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Recommendation Details + Action */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="glass-card-title">
            <Sparkles size={20} className="text-cyan" /> Explainable AI & Evidence Match
          </h2>

          {selectedCluster ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Proposal Title</span>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{selectedCluster.title}</div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Objective Evidence Validation</span>
                <div style={{ background: 'rgba(6,182,212,0.03)', border: '1px solid rgba(6,182,212,0.15)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  <strong>Satellite & Database Check:</strong> Local surveys match high demand. Travel distance validation finds no alternate node.
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Projected Social Impact</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {selectedCluster.impactMetric}
                </p>
              </div>

              {/* Explainable AI weights contribution */}
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Priority Formula Breakdown (Scores / weights)</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.1rem' }}>
                      <span>Citizen Demand ({weights.citizenDemand}%)</span>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{selectedCluster.reasoningBreakdown.demandScore}/25</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px' }}>
                      <div style={{ width: `${(selectedCluster.reasoningBreakdown.demandScore / 25) * 100}%`, height: '100%', background: 'var(--accent-cyan)', borderRadius: '2px' }}></div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.1rem' }}>
                      <span>Infrastructure Gaps ({weights.infraGap}%)</span>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{selectedCluster.reasoningBreakdown.infraGapScore}/20</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px' }}>
                      <div style={{ width: `${(selectedCluster.reasoningBreakdown.infraGapScore / 20) * 100}%`, height: '100%', background: 'var(--accent-cyan)', borderRadius: '2px' }}></div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.1rem' }}>
                      <span>Travel Distance Gap ({weights.travelDistance}%)</span>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{selectedCluster.reasoningBreakdown.distanceScore}/15</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px' }}>
                      <div style={{ width: `${(selectedCluster.reasoningBreakdown.distanceScore / 15) * 100}%`, height: '100%', background: 'var(--accent-cyan)', borderRadius: '2px' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                {selectedCluster.status === 'Recommended' ? (
                  <button 
                    onClick={() => onApproveCluster(selectedCluster.id, selectedCluster.estimatedCost)}
                    className="btn-primary" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={budgetRemaining < selectedCluster.estimatedCost}
                  >
                    {budgetRemaining < selectedCluster.estimatedCost ? 'Insufficient Budget' : `Approve & Sanction ${formatIndianCurrency(selectedCluster.estimatedCost)}`}
                  </button>
                ) : (
                  <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center', color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} /> Sanctioned & Approved (Under {selectedCluster.status})
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              Select a proposal to view explanation.
            </div>
          )}
        </div>

      </div>

      {/* Constituency Digital Twin Scenario Simulator */}
      <div className="glass-card">
        <h2 className="glass-card-title">
          <Sliders size={20} className="text-cyan" /> Constituency Digital Twin & Scenario Simulator
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Simulate strategic policy shifts by dragging sector budget sliders. See predicted developmental impacts calculated based on machine learning trend projections.
        </p>

        <div className="dashboard-grid">
          {/* Sliders Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="slider-group">
              <div className="slider-header">
                <label>Education & Schooling Allocation</label>
                <span>{simEducationBudget}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="100" 
                value={simEducationBudget} 
                onChange={(e) => setSimEducationBudget(Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Roads & Transport Infrastructure</label>
                <span>{simRoadsBudget}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="100" 
                value={simRoadsBudget} 
                onChange={(e) => setSimRoadsBudget(Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Clean Drinking Water & Sanitation</label>
                <span>{simWaterBudget}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="100" 
                value={simWaterBudget} 
                onChange={(e) => setSimWaterBudget(Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Healthcare Centres & PHCs</label>
                <span>{simHealthBudget}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="100" 
                value={simHealthBudget} 
                onChange={(e) => setSimHealthBudget(Number(e.target.value))}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: totalSimPercent > 100 ? 'rgba(244,63,94,0.05)' : 'rgba(16,185,129,0.05)', border: totalSimPercent > 100 ? '1px solid rgba(244,63,94,0.2)' : '1px solid rgba(16,185,129,0.2)', padding: '0.75rem', borderRadius: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Total Simulated Allocation:</span>
              <span style={{ fontWeight: 700, color: totalSimPercent > 100 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>{totalSimPercent}% / 100%</span>
            </div>
          </div>

          {/* Outcome Prediction Right */}
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '1.25rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Simulated Constituency Impact Projections</span>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Literacy Rate Projected Increase</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>+{simOutcomes.literacyIncrease}%</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Over 5-year school development cycle</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Average Transit Time Reduction</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>-{simOutcomes.travelReduction}%</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Decreased detour distance for rural wards</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Piped Water Supply Coverage</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>{simOutcomes.waterAccessCover}%</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Percent of rural households served</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PHC Access & Doctors Filled</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>{simOutcomes.phcCoverage}%</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Sanctioned medical post fill rate</div>
              </div>

            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '2px solid var(--accent-cyan)', paddingLeft: '0.75rem', marginTop: '0.5rem' }}>
              <strong>AI Decision Analyst Note:</strong> {totalSimPercent > 100 
                ? "Simulated budget exceeds available 100% capacity. Please scale back allocation to align budget projection."
                : `Shifting budget towards ${simWaterBudget > 30 ? 'Water & Sanitation' : 'Education'} will address critical community clusters first, optimizing the MPLADS fund utilization.`}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
