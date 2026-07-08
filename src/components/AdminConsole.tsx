import React, { useState, useEffect } from 'react';
import { Cpu, Database, Sliders, AlertCircle } from 'lucide-react';
import { type SystemWeights } from '../db/mockDb';

interface AdminConsoleProps {
  weights: SystemWeights;
  onUpdateWeights: (newWeights: SystemWeights) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  weights,
  onUpdateWeights
}) => {
  const [localWeights, setLocalWeights] = useState<SystemWeights>({ ...weights });
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Initializing LokNiti AI Priority Core...',
    '[INFO] Loaded IndicBhasha translation engine v2.1',
    '[INFO] Geocoder boundary indices synchronized (GRCh38 equivalents)',
    '[INFO] PostGIS database connection: pool active (20 connections)',
    '[INFO] Clustered 7 citizen reports into CL-001 (Panchpara Bridge)',
    '[INFO] Clustered 4 citizen reports into CL-002 (Madhupur Water)'
  ]);

  // Synchronize local weights with parent
  useEffect(() => {
    setLocalWeights({ ...weights });
  }, [weights]);

  // Simulate scrolling server logs
  useEffect(() => {
    const logPool = [
      '[INFO] WhatsApp webhook received incoming payload (Bengali VoiceNote)...',
      '[AI STT] Transcription completed: "বর্ষা হলেই রাস্তা ডুবে যায়..."',
      '[AI TRANSLATION] Translation output: "Road gets submerged in monsoon..."',
      '[AI NLP] Classified Category: Roads | Confidence: 98.4%',
      '[AI DUPLICATE] High semantic match (92.5%) with CL-001. Linking request.',
      '[INFO] Priority score updated for CL-001 (New Score: 94)',
      '[SYSTEM] Dispatched WhatsApp status update to +91 98300 XXXXX',
      '[INFO] SMS gateway received check-status request for REQ-003...',
      '[AI GIS] Geocoding matched coordinates to Madhupur village (V6)',
      '[INFO] Census database search matched deficient sanitation index in V3'
    ];

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev.slice(-15), `[${timestamp}] ${randomLog}`]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleWeightChange = (key: keyof SystemWeights, value: number) => {
    const updated = { ...localWeights, [key]: value };
    setLocalWeights(updated);
    onUpdateWeights(updated);
  };

  const totalWeight = 
    localWeights.citizenDemand + 
    localWeights.infraGap + 
    localWeights.travelDistance + 
    localWeights.popDensity + 
    localWeights.vulnerablePop + 
    localWeights.popGrowth + 
    localWeights.planAlignment + 
    localWeights.costEffectiveness;

  return (
    <div className="admin-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="dashboard-grid">
        
        {/* Priority Weights Tuner */}
        <div className="glass-card">
          <h2 className="glass-card-title">
            <Sliders size={20} className="text-cyan" /> Priority Model Weight Tuner
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Adjust weights representing the relative value of citizen feedback vs objective data in the prioritization model. Total weights should equal 100%.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            <div className="slider-group">
              <div className="slider-header">
                <label>Citizen Demand & Votes Density</label>
                <span>{localWeights.citizenDemand}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="50" 
                value={localWeights.citizenDemand} 
                onChange={(e) => handleWeightChange('citizenDemand', Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Infrastructure Gaps (Village Deficiencies)</label>
                <span>{localWeights.infraGap}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="50" 
                value={localWeights.infraGap} 
                onChange={(e) => handleWeightChange('infraGap', Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Travel Distance Gaps (GIS overlay)</label>
                <span>{localWeights.travelDistance}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="50" 
                value={localWeights.travelDistance} 
                onChange={(e) => handleWeightChange('travelDistance', Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Population Density</label>
                <span>{localWeights.popDensity}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="30" 
                value={localWeights.popDensity} 
                onChange={(e) => handleWeightChange('popDensity', Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Vulnerable Population Index</label>
                <span>{localWeights.vulnerablePop}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="30" 
                value={localWeights.vulnerablePop} 
                onChange={(e) => handleWeightChange('vulnerablePop', Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Projected 5-Year Population Growth</label>
                <span>{localWeights.popGrowth}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="30" 
                value={localWeights.popGrowth} 
                onChange={(e) => handleWeightChange('popGrowth', Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Plan Alignment (State/Central Schemes)</label>
                <span>{localWeights.planAlignment}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="20" 
                value={localWeights.planAlignment} 
                onChange={(e) => handleWeightChange('planAlignment', Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Cost Effectiveness (Inverted Budget Cost)</label>
                <span>{localWeights.costEffectiveness}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="20" 
                value={localWeights.costEffectiveness} 
                onChange={(e) => handleWeightChange('costEffectiveness', Number(e.target.value))}
              />
            </div>

            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                background: totalWeight === 100 ? 'rgba(16,185,129,0.05)' : 'rgba(244,63,94,0.05)', 
                border: `1px solid ${totalWeight === 100 ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`, 
                padding: '0.75rem', 
                borderRadius: '0.5rem' 
              }}
            >
              <span style={{ fontSize: '0.85rem' }}>Weights Sum:</span>
              <span style={{ fontWeight: 700, color: totalWeight === 100 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                {totalWeight}% / 100%
              </span>
            </div>
            
            {totalWeight !== 100 && (
              <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--accent-rose)', fontSize: '0.75rem', alignItems: 'center' }}>
                <AlertCircle size={14} /> Total weights do not equal 100%. Priority lists on MP dashboards will be scale-adjusted.
              </div>
            )}

          </div>
        </div>

        {/* AI Engine & System Metrics Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-card">
            <h2 className="glass-card-title">
              <Cpu size={20} className="text-cyan" /> Model Performance Metrics
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Ingestion Translation Model</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>IndicBhasha v2.1</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>F1-Score: 0.96</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Audio Processing Latency</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>450 ms average</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>Whisper API integration</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Deduplication Clustering</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>91.2% accuracy</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>1420 files grouped</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>OCR Character Error</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>1.4% Error Rate</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>Sub-millimeter geolocation</div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 className="glass-card-title">
              <Database size={20} className="text-cyan" /> System Ingestion Log Stream
            </h2>
            
            <div 
              style={{ 
                flex: 1, 
                background: '#070a13', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '0.5rem', 
                padding: '0.75rem', 
                fontFamily: 'monospace', 
                fontSize: '0.7rem', 
                color: '#34d399', 
                height: '240px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}
            >
              {logs.map((log, i) => (
                <div key={i} style={{ lineBreak: 'anywhere' }}>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
