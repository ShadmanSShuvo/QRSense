import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  RotateCcw,
  Activity,
  AlertTriangle,
  Sliders,
  Heart,
  Cpu,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

/**
 * BeatInspectionPanel
 *
 * Provides progressive disclosure for individual beat morphology, fiducial markers,
 * and Pan-Tompkins dual-threshold decision criteria.
 */
export default function BeatInspectionPanel({
  data,
  selectedBeatIndex = 0,
  setSelectedBeatIndex = () => {},
  activeStage = 'original',
  fs = 360,
  focusBeat = () => {},
  resetZoom = () => {},
  cardStyle = {},
}) {
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  const delineation = data?.delineation || [];
  if (delineation.length === 0) return null;

  const selectedBeat = delineation[selectedBeatIndex] || delineation[0];
  const totalBeats = delineation.length;
  const isSearchback = selectedBeat?.detection_evidence?.method === 'searchback';
  const domType = selectedBeat?.dominant_deflection_type
    ? selectedBeat.dominant_deflection_type.toUpperCase()
    : 'NORMAL';

  const ev = selectedBeat?.detection_evidence || {};

  const handlePrev = () => {
    const prevIdx = Math.max(0, selectedBeatIndex - 1);
    setSelectedBeatIndex(prevIdx);
    focusBeat(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(totalBeats - 1, selectedBeatIndex + 1);
    setSelectedBeatIndex(nextIdx);
    focusBeat(nextIdx);
  };

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '0.75rem 0.95rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Beat Header & Quick Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
            Beat #{(selectedBeat?.beat_index ?? 0) + 1}{' '}
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 400 }}>
              of {totalBeats}
            </span>
          </span>

          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
              background: isSearchback ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: isSearchback ? '#fbbf24' : '#34d399',
              border: isSearchback ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
            }}
          >
            {isSearchback ? '★ Search-Back Recovery' : '✓ Primary Dual-Threshold'}
          </span>

          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              background: 'rgba(59, 130, 246, 0.18)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.4)',
            }}
          >
            {domType} MORPHOLOGY
          </span>

          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            Fiducial:{' '}
            <strong style={{ color: '#e2e8f0' }}>
              {typeof selectedBeat?.pt_qrs_index === 'number'
                ? `${(selectedBeat.pt_qrs_index / fs).toFixed(3)} s (Spl ${selectedBeat.pt_qrs_index})`
                : '--'}
            </strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="stage-btn"
            onClick={handlePrev}
            disabled={selectedBeatIndex === 0}
            style={{ padding: '0.28rem 0.55rem', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
          >
            <ChevronLeft size={13} /> Prev
          </button>

          <button
            type="button"
            className="stage-btn"
            onClick={handleNext}
            disabled={selectedBeatIndex === totalBeats - 1}
            style={{ padding: '0.28rem 0.55rem', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
          >
            Next <ChevronRight size={13} />
          </button>

          <button
            type="button"
            className="stage-btn"
            onClick={() => focusBeat(selectedBeatIndex)}
            style={{ padding: '0.28rem 0.55rem', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
          >
            <ZoomIn size={13} /> Zoom Beat
          </button>

          <button
            type="button"
            className="stage-btn"
            onClick={resetZoom}
            style={{ padding: '0.28rem 0.55rem', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
          >
            <RotateCcw size={13} /> 0-10s
          </button>
        </div>
      </div>

      {/* Morphological Measurements when on Original Stage */}
      {activeStage === 'original' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '0.45rem',
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '0.5rem 0.65rem',
            borderRadius: '8px',
            border: '1px solid rgba(51, 65, 85, 0.4)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase' }}>Q Nadir</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f59e0b', marginTop: '0.1rem' }}>
              {typeof selectedBeat?.q_time === 'number' ? `${selectedBeat.q_time.toFixed(3)} s` : 'None'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase' }}>R Peak</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ef4444', marginTop: '0.1rem' }}>
              {typeof selectedBeat?.r_time === 'number' ? `${selectedBeat.r_time.toFixed(3)} s` : 'QS'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase' }}>S Nadir</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#38bdf8', marginTop: '0.1rem' }}>
              {typeof selectedBeat?.s_time === 'number' ? `${selectedBeat.s_time.toFixed(3)} s` : 'None'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase' }}>QRS Duration</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#10b981', marginTop: '0.1rem' }}>
              {typeof selectedBeat?.qrs_duration_ms === 'number' ? `${selectedBeat.qrs_duration_ms.toFixed(1)} ms` : '--'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase' }}>Baseline</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#cbd5e1', marginTop: '0.1rem' }}>
              {typeof selectedBeat?.isoelectric_baseline === 'number' ? `${selectedBeat.isoelectric_baseline.toFixed(3)} mV` : '--'}
            </div>
          </div>
        </div>
      )}

      {/* Primary 5 Evidence Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.45rem',
        }}
      >
        {/* 1. Signal Peak Card */}
        <div style={{ background: 'rgba(30, 41, 59, 0.65)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '8px', padding: '0.55rem 0.65rem' }}>
          <div style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Activity size={12} /> Signal Peak
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.15rem' }}>
            SPKI: {ev.spki !== undefined ? ev.spki.toFixed(4) : '--'}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
            SPKF: {ev.spkf !== undefined ? ev.spkf.toFixed(4) : '--'}
          </div>
        </div>

        {/* 2. Noise Peak Card */}
        <div style={{ background: 'rgba(30, 41, 59, 0.65)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '8px', padding: '0.55rem 0.65rem' }}>
          <div style={{ fontSize: '0.66rem', color: '#f87171', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <AlertTriangle size={12} /> Noise Peak
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.15rem' }}>
            NPKI: {ev.npki !== undefined ? ev.npki.toFixed(4) : '--'}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
            NPKF: {ev.npkf !== undefined ? ev.npkf.toFixed(4) : '--'}
          </div>
        </div>

        {/* 3. Threshold Card */}
        <div style={{ background: 'rgba(30, 41, 59, 0.65)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '8px', padding: '0.55rem 0.65rem' }}>
          <div style={{ fontSize: '0.66rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Sliders size={12} /> Threshold
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.15rem' }}>
            TH_I1: {ev.threshold_i1 !== undefined ? ev.threshold_i1.toFixed(4) : '--'}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
            TH_I2: {ev.threshold_i2 !== undefined ? ev.threshold_i2.toFixed(4) : '--'}
          </div>
        </div>

        {/* 4. RR Interval Card */}
        <div style={{ background: 'rgba(30, 41, 59, 0.65)', border: '1px solid rgba(167, 139, 250, 0.35)', borderRadius: '8px', padding: '0.55rem 0.65rem' }}>
          <div style={{ fontSize: '0.66rem', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Heart size={12} /> RR Interval
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.15rem' }}>
            {ev.rr_interval_ms ? `${ev.rr_interval_ms.toFixed(1)} ms` : (selectedBeat?.beat_index === 0 ? 'Initial Beat' : '--')}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
            {ev.rr_interval_ms ? `~${Math.round(60000 / ev.rr_interval_ms)} bpm` : 'Learning phase'}
          </div>
        </div>

        {/* 5. Detection Method Card */}
        <div style={{ background: 'rgba(30, 41, 59, 0.65)', border: isSearchback ? '1px solid rgba(245, 158, 11, 0.45)' : '1px solid rgba(59, 130, 246, 0.35)', borderRadius: '8px', padding: '0.55rem 0.65rem' }}>
          <div style={{ fontSize: '0.66rem', color: isSearchback ? '#fbbf24' : '#60a5fa', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Cpu size={12} /> Method
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isSearchback ? '#fbbf24' : '#38bdf8', marginTop: '0.15rem' }}>
            {isSearchback ? 'Search-Back' : 'Primary Detection'}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#10b981' }}>
            ✓ Refractory &gt; 200 ms
          </div>
        </div>
      </div>

      {/* Collapsible Detailed State Accordion */}
      <div style={{ border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '8px', overflow: 'hidden' }}>
        <button
          type="button"
          onClick={() => setIsEvidenceOpen(!isEvidenceOpen)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.5)',
            border: 'none',
            color: '#cbd5e1',
            padding: '0.45rem 0.75rem',
            fontSize: '0.74rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cpu size={13} color="#f59e0b" />
            Adaptive State &amp; Dual-Threshold Evidence
          </span>
          {isEvidenceOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {isEvidenceOpen && (
          <div
            style={{
              padding: '0.65rem 0.75rem',
              borderTop: '1px solid rgba(51, 65, 85, 0.4)',
              fontSize: '0.74rem',
              color: '#94a3b8',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.65rem',
              background: 'rgba(15, 23, 42, 0.75)',
            }}
          >
            <div>
              <strong style={{ color: '#e2e8f0', display: 'block', marginBottom: '0.2rem' }}>
                Integrated State (SPKI / NPKI)
              </strong>
              <div>Signal Level: <span style={{ color: '#10b981' }}>{ev.spki !== undefined ? ev.spki.toFixed(4) : '--'}</span></div>
              <div>Noise Level: <span style={{ color: '#f87171' }}>{ev.npki !== undefined ? ev.npki.toFixed(4) : '--'}</span></div>
              <div>Threshold I1: <span style={{ color: '#f59e0b' }}>{ev.threshold_i1 !== undefined ? ev.threshold_i1.toFixed(4) : '--'}</span></div>
              <div>Threshold I2: <span style={{ color: '#fbbf24' }}>{ev.threshold_i2 !== undefined ? ev.threshold_i2.toFixed(4) : '--'}</span></div>
            </div>

            <div>
              <strong style={{ color: '#e2e8f0', display: 'block', marginBottom: '0.2rem' }}>
                Filtered State (SPKF / NPKF)
              </strong>
              <div>Signal Level: <span style={{ color: '#10b981' }}>{ev.spkf !== undefined ? ev.spkf.toFixed(4) : '--'}</span></div>
              <div>Noise Level: <span style={{ color: '#f87171' }}>{ev.npkf !== undefined ? ev.npkf.toFixed(4) : '--'}</span></div>
              <div>Threshold F1: <span style={{ color: '#f59e0b' }}>{ev.threshold_f1 !== undefined ? ev.threshold_f1.toFixed(4) : '--'}</span></div>
              <div>Threshold F2: <span style={{ color: '#fbbf24' }}>{ev.threshold_f2 !== undefined ? ev.threshold_f2.toFixed(4) : '--'}</span></div>
            </div>

            <div>
              <strong style={{ color: '#e2e8f0', display: 'block', marginBottom: '0.2rem' }}>
                Classification Criteria
              </strong>
              <div>Refractory: <span style={{ color: '#10b981' }}>Passed (&gt; 200 ms)</span></div>
              <div>T-Wave Test: <span style={{ color: '#10b981' }}>Passed (slope check)</span></div>
              <div style={{ marginTop: '0.2rem', color: isSearchback ? '#fbbf24' : '#34d399' }}>
                {isSearchback
                  ? 'Recovered via Search-Back (PEAKI > TH_I2 & PEAKF > TH_F2)'
                  : 'Confirmed Primary QRS (PEAKI > TH_I1 & PEAKF > TH_F1)'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Diagnostic Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.7rem',
          color: '#94a3b8',
          paddingTop: '0.2rem',
          borderTop: '1px solid rgba(51, 65, 85, 0.4)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '2px', background: 'rgba(239, 68, 68, 0.25)', border: '1px solid #ef4444', display: 'inline-block' }} />
          <span>200 ms Refractory Blanking</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: 7, height: 7, transform: 'rotate(45deg)', background: '#f59e0b', display: 'inline-block' }} />
          <span>Search-Back Recovery</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', border: '1.5px solid #c084fc', display: 'inline-block' }} />
          <span>Rejected T-Wave</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: 10, height: 2, background: '#f59e0b', display: 'inline-block' }} />
          <span>TH1 / TH2 Curves</span>
        </div>
      </div>
    </div>
  );
}
