import React, { useState } from 'react';
import { 
  ClipboardList, CheckCircle2, AlertTriangle, Truck, 
  ShieldAlert, Wrench, FileSpreadsheet, Undo2
} from 'lucide-react';
import { type IssueCluster, type Village, type ActionLogItem, formatIndianCurrency } from '../db/mockDb';

interface OfficerDashboardProps {
  clusters: IssueCluster[];
  villages: Village[];
  onUpdateClusterStatus: (id: string, newStatus: IssueCluster['status']) => void;
  actionHistory: ActionLogItem[];
  onUndoAction: (id: string) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  clusters,
  villages,
  onUpdateClusterStatus,
  actionHistory,
  onUndoAction
}) => {
  // Pre-load mock alerts
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 'ALT-01',
      type: 'Water',
      villageId: 'AS5',
      title: 'Beleghata Water Table Depletion',
      desc: 'Beleghata (AS5) groundwater level has dropped by 8m. Severe localized drinking water scarcity predicted within 15 days.',
      recommendation: 'Redistribute 2 backup mobile tankers from Chowringhee (AS6) to Beleghata (AS5) for immediate relief.',
      severity: 'Critical',
      resolved: false
    },
    {
      id: 'ALT-02',
      type: 'Health',
      villageId: 'AS1',
      title: 'Kashipur Pre-emptive Dengue Warning',
      desc: 'Kashipur (AS1) registered a 42% humidity surge combined with local waterlogging reports. Outbreak risk is 84% in next 10 days.',
      recommendation: 'Fogging machinery dispatch and deploy 1 medical officer from Shyampukur PHC (AS2).',
      severity: 'High',
      resolved: false
    }
  ]);

  const handleResolveAlert = (id: string) => {
    setActiveAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  // Filter approved/ongoing projects
  const activeProjects = clusters.filter(c => ['Approved', 'In Progress', 'Completed'].includes(c.status));

  return (
    <div className="officer-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Forecasting Alerts Panel */}
      <div className="glass-card">
        <h2 className="glass-card-title text-rose">
          <ShieldAlert size={20} className="text-cyan" /> AI Forecasting & Resource Alerts
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          The LokNiti Predictive Engine fuses local weather indicators, GIS groundwater monitors, and PHC patient logs to dispatch warnings before crises arise.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activeAlerts.map(alert => (
            <div 
              key={alert.id}
              style={{ 
                background: alert.resolved ? 'rgba(16, 185, 129, 0.03)' : 'rgba(244, 63, 94, 0.03)', 
                border: `1px solid ${alert.resolved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`, 
                borderRadius: '0.75rem', 
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', maxWidth: '75%' }}>
                <div style={{ 
                  background: alert.resolved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)', 
                  color: alert.resolved ? 'var(--accent-emerald)' : 'var(--accent-rose)', 
                  padding: '0.5rem', 
                  borderRadius: '0.5rem',
                  marginTop: '0.2rem'
                }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{alert.title}</span>
                    <span style={{ 
                      background: alert.resolved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)', 
                      color: alert.resolved ? 'var(--accent-emerald)' : 'var(--accent-rose)', 
                      fontSize: '0.65rem', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '9999px',
                      fontWeight: 600
                    }}>
                      {alert.resolved ? 'Resolved' : alert.severity}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {alert.desc}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '0.5rem', fontWeight: 500 }}>
                    <strong>AI Suggested Action:</strong> {alert.recommendation}
                  </p>
                </div>
              </div>

              <div>
                {!alert.resolved ? (
                  <button 
                    onClick={() => handleResolveAlert(alert.id)}
                    className="btn-primary" 
                    style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Truck size={14} /> Dispatch Resources
                  </button>
                ) : (
                  <div style={{ color: 'var(--accent-emerald)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={16} /> Action Sanctioned
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Ledger & Undo Center */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <h2 className="glass-card-title" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Undo2 size={20} className="text-cyan" /> Constituency Action Ledger & Undo Center (Officer Read/Write)
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: '180px', paddingRight: '0.25rem' }}>
          {actionHistory.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.5rem', textAlign: 'center' }}>
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
                  padding: '0.5rem 0.75rem',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', maxWidth: '80%' }}>
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

      {/* Project Execution Grid */}
      <div className="three-column-grid">
        
        {/* Approved and Ongoing Projects */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="glass-card-title">
            <ClipboardList size={20} className="text-cyan" /> Project Audit & Stage Workflow
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Officer interface to verify and progress sanctioned MPLADS development works.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '480px' }}>
            {activeProjects.map(proj => (
              <div 
                key={proj.id}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.01)', 
                  border: '1px solid var(--glass-border)', 
                  borderRadius: '0.75rem', 
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    {proj.id} | {villages.find(v => v.id === proj.locationId)?.name}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    color: proj.status === 'Completed' ? 'var(--accent-emerald)' : proj.status === 'In Progress' ? 'var(--accent-cyan)' : 'var(--accent-amber)'
                  }}>
                    {proj.status}
                  </span>
                </div>

                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{proj.title}</div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Est. Cost: {formatIndianCurrency(proj.estimatedCost)} | Impact: {proj.beneficiaries} residents
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                  {proj.status === 'Approved' && (
                    <button 
                      onClick={() => onUpdateClusterStatus(proj.id, 'In Progress')}
                      className="btn-primary" 
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', flex: 1, justifyContent: 'center' }}
                    >
                      <Wrench size={12} /> Issue Tender & Begin Work
                    </button>
                  )}
                  {proj.status === 'In Progress' && (
                    <button 
                      onClick={() => onUpdateClusterStatus(proj.id, 'Completed')}
                      className="btn-primary" 
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, var(--accent-emerald), #047857)' }}
                    >
                      <CheckCircle2 size={12} /> Field Verify & Complete
                    </button>
                  )}
                  {proj.status === 'Completed' && (
                    <div style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', width: '100%', justifyContent: 'center' }}>
                      <CheckCircle2 size={14} /> Completed & Asset Audited
                    </div>
                  )}
                </div>
              </div>
            ))}
            {activeProjects.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No active sanctioned projects. Use MP dashboard to approve recommendations.
              </div>
            )}
          </div>
        </div>

        {/* Administrative Department Performance */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="glass-card-title">
            <FileSpreadsheet size={20} className="text-cyan" /> Department Audits & KPIs
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Administrative performance ranking based on project cycle speed & compliance.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Water & Sanitation (PHED)</span>
                <span style={{ color: 'var(--accent-emerald)' }}>94% Efficiency</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Avg resolution: 11 days. Budget discrepancy: 1.2%</p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Roads & Buildings (PWD)</span>
                <span style={{ color: 'var(--accent-amber)' }}>81% Efficiency</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Avg resolution: 28 days. Heavy detour delay backlogs.</p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Primary Education Department</span>
                <span style={{ color: 'var(--accent-emerald)' }}>90% Efficiency</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Avg resolution: 14 days. Pupil classroom ratios monitored.</p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Health & Medical Services</span>
                <span style={{ color: 'var(--accent-rose)' }}>68% Efficiency</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Sanctioned vacancy gaps (18 doctor positions empty).</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
