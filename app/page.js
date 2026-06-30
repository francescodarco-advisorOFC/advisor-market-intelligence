'use client';

import { useState } from 'react';

export default function Home() {
  const [brand1, setBrand1] = useState('');
  const [brand2, setBrand2] = useState('');
  const [trimester, setTrimester] = useState('Q2');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');

  const handleGenerate = async () => {
    if (!brand1 || !brand2) {
      alert('Inserisci entrambi i brand');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/marketIntelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand1, brand2, trimester })
      });

      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setReport(data);
    } catch (error) {
      alert('Errore: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBrand1('');
    setBrand2('');
    setReport(null);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ animation: 'spin 1s linear infinite', width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #0ea5e9', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
        <p>Ricercando su tutte le fonti italiane...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; color: #1f2937; }
        .header { background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 2rem; text-align: center; }
        .header h1 { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
        .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
        .form-section { background: #f8f9fa; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #e5e7eb; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr 150px 150px; gap: 12px; }
        .form-group { display: flex; flex-direction: column; }
        .form-group label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; margin-bottom: 6px; }
        input, select { padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; }
        input:focus, select:focus { outline: none; border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }
        button { padding: 10px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; }
        .btn-primary { background: #0ea5e9; color: white; }
        .btn-primary:hover { background: #0284c7; }
        .btn-secondary { background: #10b981; color: white; margin-right: 8px; }
        .btn-secondary:hover { background: #059669; }
        .tabs { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-bottom: 2rem; }
        .tab-btn { padding: 10px 16px; border: 2px solid #e5e7eb; background: white; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; }
        .tab-btn.active { border-color: #0ea5e9; background: #eff6ff; color: #0ea5e9; }
        .section { display: none; }
        .section.active { display: block; }
        .event-item { background: #f8f9fa; padding: 12px; margin-bottom: 8px; border-left: 4px solid #0ea5e9; border-radius: 4px; }
        .legend-section { background: #eff6ff; padding: 1.5rem; border-left: 4px solid #0ea5e9; border-radius: 4px; margin-top: 1.5rem; }
        .legend-item { margin-bottom: 1rem; font-size: 13px; line-height: 1.5; }
        .legend-item strong { color: #1e40af; }
        .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 2rem; }
        .comparison-card { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border: 1px solid #e5e7eb; }
        .comparison-card h3 { font-size: 16px; font-weight: 700; color: #1e40af; margin-bottom: 1rem; padding-bottom: 8px; border-bottom: 2px solid #0ea5e9; }
        .metric { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
        .title { font-size: 24px; font-weight: 700; color: #1e40af; margin-bottom: 1rem; }
        .subtitle { font-size: 14px; color: #6b7280; margin-bottom: 2rem; }
      `}</style>

      <div className="header">
        <h1>ADVISOR Market Intelligence Report</h1>
        <p>Analisi reputazionale comparativa con ricerca completa su fonti italiane</p>
      </div>

      <div className="container">
        {!report ? (
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label>Brand primario</label>
                <input
                  type="text"
                  value={brand1}
                  onChange={(e) => setBrand1(e.target.value)}
                  placeholder="Es. Pictet, Morgan Stanley..."
                />
              </div>
              <div className="form-group">
                <label>Brand da confrontare</label>
                <input
                  type="text"
                  value={brand2}
                  onChange={(e) => setBrand2(e.target.value)}
                  placeholder="Es. BNP Paribas, Amundi..."
                />
              </div>
              <div className="form-group">
                <label>Trimestre</label>
                <select value={trimester} onChange={(e) => setTrimester(e.target.value)}>
                  <option value="Q1">Q1 2026</option>
                  <option value="Q2">Q2 2026</option>
                  <option value="Q3">Q3 2026</option>
                  <option value="Q4">Q4 2026</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <button className="btn-primary" onClick={handleGenerate}>
                  Genera Report
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <button className="btn-secondary" onClick={() => window.print()}>
                🖨️ Stampa
              </button>
              <button className="btn-secondary" onClick={handleReset}>
                ↻ Nuovo
              </button>
            </div>

            <div className="title">{report.brand1} vs {report.brand2}</div>
            <div className="subtitle">Analisi comparativa {report.trimester} 2026</div>

            <div className="tabs">
              <button
                className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                onClick={() => setActiveTab('timeline')}
              >
                📅 Timeline
              </button>
              <button
                className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
                onClick={() => setActiveTab('comparison')}
              >
                📊 Confronto
              </button>
              <button
                className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
                onClick={() => setActiveTab('media')}
              >
                📈 Media
              </button>
            </div>

            {activeTab === 'timeline' && (
              <div className="section active">
                <h2 style={{ marginBottom: '1rem', color: '#1e40af' }}>Timeline Eventi</h2>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '16px' }}>{report.brand1}</h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '0.5rem' }}>✓ Eventi Propri</div>
                    {(report.data1.own_events || []).map((e, i) => (
                      <div key={i} className="event-item">
                        <div style={{ fontWeight: 700, color: '#0ea5e9', fontSize: '12px' }}>{e.date}</div>
                        <div style={{ fontWeight: 600, margin: '4px 0' }}>{e.title}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{e.type} • {e.city}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '0.5rem' }}>◆ Eventi Collettivi</div>
                    {(report.data1.industry_events || []).map((e, i) => (
                      <div key={i} className="event-item">
                        <div style={{ fontWeight: 700, color: '#0ea5e9', fontSize: '12px' }}>{e.date}</div>
                        <div style={{ fontWeight: 600, margin: '4px 0' }}>{e.title}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {e.presence ? '✓ Presente' : '✗ Assente'} • {e.role}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#eff6ff', padding: '1rem', borderLeft: '4px solid #0ea5e9', borderRadius: '4px', marginTop: '1rem', fontSize: '13px', color: '#1e40af' }}>
                    {report.data1.timeline_comment}
                  </div>
                </div>

                <div>
                  <h3 style={{ marginBottom: '1rem', fontSize: '16px' }}>{report.brand2}</h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '0.5rem' }}>✓ Eventi Propri</div>
                    {(report.data2.own_events || []).map((e, i) => (
                      <div key={i} className="event-item">
                        <div style={{ fontWeight: 700, color: '#0ea5e9', fontSize: '12px' }}>{e.date}</div>
                        <div style={{ fontWeight: 600, margin: '4px 0' }}>{e.title}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{e.type} • {e.city}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '0.5rem' }}>◆ Eventi Collettivi</div>
                    {(report.data2.industry_events || []).map((e, i) => (
                      <div key={i} className="event-item">
                        <div style={{ fontWeight: 700, color: '#0ea5e9', fontSize: '12px' }}>{e.date}</div>
                        <div style={{ fontWeight: 600, margin: '4px 0' }}>{e.title}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {e.presence ? '✓ Presente' : '✗ Assente'} • {e.role}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#eff6ff', padding: '1rem', borderLeft: '4px solid #0ea5e9', borderRadius: '4px', marginTop: '1rem', fontSize: '13px', color: '#1e40af' }}>
                    {report.data2.timeline_comment}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'comparison' && (
              <div className="section active">
                <h2 style={{ marginBottom: '1rem', color: '#1e40af' }}>Pilastri Reputazionali</h2>
                <div className="comparison-grid">
                  <div className="comparison-card">
                    <h3>{report.brand1}</h3>
                    {Object.entries(report.data1.reputation_scores || {}).map(([key, val]) => (
                      <div key={key} className="metric">
                        <span style={{ color: '#6b7280' }}>{key.replace(/_/g, ' ')}</span>
                        <span style={{ fontWeight: 700, color: '#0ea5e9' }}>{(val || 0).toFixed(1)}/10</span>
                      </div>
                    ))}
                  </div>
                  <div className="comparison-card">
                    <h3>{report.brand2}</h3>
                    {Object.entries(report.data2.reputation_scores || {}).map(([key, val]) => (
                      <div key={key} className="metric">
                        <span style={{ color: '#6b7280' }}>{key.replace(/_/g, ' ')}</span>
                        <span style={{ fontWeight: 700, color: '#0ea5e9' }}>{(val || 0).toFixed(1)}/10</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="legend-section">
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af', marginBottom: '1rem' }}>📋 Legenda Pilastri Reputazionali</div>
                  <div className="legend-item">
                    <strong>Autorità Mediatica:</strong> Copertura su testate premium, qualità tono, speaking role
                  </div>
                  <div className="legend-item">
                    <strong>Narrativa Innovativa:</strong> Positioning su temi emergenti (longevity, blockchain, ESG, AI)
                  </div>
                  <div className="legend-item">
                    <strong>Intensità Relazionale:</strong> Roadshow, webinar, EFPA, iniziative proprietarie
                  </div>
                  <div className="legend-item">
                    <strong>Leadership di Pensiero:</strong> Research, speaking, podcast, expert quotes
                  </div>
                  <div className="legend-item">
                    <strong>Presenza Social:</strong> LinkedIn followers/engagement, YouTube consistency
                  </div>
                  <div className="legend-item">
                    <strong>Differenziazione Competitiva:</strong> Unique positioning, awards, exclusive events
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="section active">
                <h2 style={{ marginBottom: '1rem', color: '#1e40af' }}>Media Analysis & Awards</h2>
                <div className="comparison-grid">
                  <div className="comparison-card">
                    <h3>{report.brand1}</h3>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '0.5rem' }}>Menzioni Media</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#0ea5e9' }}>
                        {report.data1.media_mentions?.count || 0}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '0.5rem' }}>Top Outlet</div>
                      {(report.data1.media_mentions?.top_outlets || []).map((outlet, i) => (
                        <div key={i} style={{ fontSize: '12px', color: '#6b7280' }}>• {outlet}</div>
                      ))}
                    </div>
                  </div>
                  <div className="comparison-card">
                    <h3>{report.brand2}</h3>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '0.5rem' }}>Menzioni Media</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#0ea5e9' }}>
                        {report.data2.media_mentions?.count || 0}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '0.5rem' }}>Top Outlet</div>
                      {(report.data2.media_mentions?.top_outlets || []).map((outlet, i) => (
                        <div key={i} style={{ fontSize: '12px', color: '#6b7280' }}>• {outlet}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
