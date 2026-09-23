import React from 'react';
import { Heart, Activity, CheckCircle2, AlertTriangle, Cpu, Radio } from 'lucide-react';

/**
 * DiagnosticBar
 *
 * Compact diagnostic strip (~50px tall) displaying clinical rhythm metrics
 * and Pan-Tompkins detection statistics. Adapts its information density
 * dynamically based on the active workspace view:
 *   - 'standard': Full diagnostic summary + Pan-Tompkins state badges
 *   - 'clean': Essential clinical metrics
 *   - 'ecg-only': Focused signal metrics
 */
export default function DiagnosticBar({
  analysis = {},
  stages = {},
  delineation = [],
  selectedBeatIndex = 0,
  workspaceView = 'standard',
}) {
  const hr = analysis?.hr_bpm ? `${analysis.hr_bpm} BPM` : '--';
  const sdnn = analysis?.sdnn_ms ? `${analysis.sdnn_ms} ms` : '--';
  const abnormalities = analysis?.abnormalities || [];
  const primaryAbnormality = abnormalities.length > 0 ? abnormalities[0] : 'Normal Sinus Rhythm';
  const isNormal = primaryAbnormality.toLowerCase().includes('normal');

  const qrsCount = stages?.detected_peaks?.length ?? delineation.length ?? '--';
  const searchbackCount = stages?.searchback?.length ?? 0;
  const rejectedTCount = stages?.rejected_t_waves?.length ?? 0;

  const currentBeat = delineation[selectedBeatIndex];
  const isSearchback = currentBeat?.detection_evidence?.method === 'searchback';

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.25rem 0.55rem',
    borderRadius: '6px',
    fontSize: '0.74rem',
    fontWeight: 600,
    lineHeight: 1,
    whiteSpace: 'nowrap',
  };

  const dividerStyle = {
    width: '1px',
    height: '24px',
    background: 'rgba(51, 65, 85, 0.7)',
    margin: '0 0.25rem',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.88)',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '0.5rem 0.95rem',
        minHeight: '48px',
        width: '100%',
        boxSizing: 'border-box',
        gap: '0.85rem',
        overflowX: 'auto',
        userSelect: 'none',
      }}
    >
      {/* Group 1: Hemodynamics & Rhythm */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexShrink: 0 }}>
        {/* Heart Rate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Heart size={16} color="#ef4444" style={{ filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.4))' }} />
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>HR</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', fontVariantNumeric: 'tabular-nums' }}>
            {hr}
          </span>
        </div>

        {/* HRV (SDNN) — visible in standard and clean */}
        {workspaceView !== 'ecg-only' && (
          <>
            <span style={{ color: '#334155' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Activity size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>HRV</span>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#38bdf8', fontVariantNumeric: 'tabular-nums' }}>
                {sdnn}
              </span>
            </div>
          </>
        )}

        {/* Rhythm Status Badge */}
        <span style={{ color: '#334155' }}>•</span>
        <div
          style={{
            ...badgeStyle,
            background: isNormal ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: isNormal ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
            color: isNormal ? '#34d399' : '#f87171',
          }}
          title={abnormalities.join(' | ') || 'Normal Sinus Rhythm'}
        >
          {isNormal ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
          <span>{primaryAbnormality}</span>
        </div>
      </div>

      {/* Divider */}
      <div style={dividerStyle} />

      {/* Group 2: Pan-Tompkins Algorithm Statistics */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
        {/* QRS Detected Count */}
        <div
          style={{
            ...badgeStyle,
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34d399',
          }}
          title="Total QRS complexes detected by Pan-Tompkins"
        >
          <Cpu size={13} />
          <span>QRS:</span>
          <strong>{qrsCount}</strong>
        </div>

        {/* Search-Back Count — in standard view */}
        {workspaceView === 'standard' && (
          <div
            style={{
              ...badgeStyle,
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#fbbf24',
            }}
            title="Beats identified via dual-threshold search-back"
          >
            <span style={{ width: 6, height: 6, transform: 'rotate(45deg)', background: '#f59e0b', display: 'inline-block' }} />
            <span>Search-back:</span>
            <strong>{searchbackCount}</strong>
          </div>
        )}

        {/* Rejected T-Waves — in standard view */}
        {workspaceView === 'standard' && (
          <div
            style={{
              ...badgeStyle,
              background: 'rgba(192, 132, 252, 0.12)',
              border: '1px solid rgba(192, 132, 252, 0.35)',
              color: '#c084fc',
            }}
            title="Candidate peaks rejected as physiological T-waves by slope comparison"
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', border: '1px solid #c084fc', display: 'inline-block' }} />
            <span>Rejected T:</span>
            <strong>{rejectedTCount}</strong>
          </div>
        )}

        {/* Selected Beat Indicator */}
        {delineation.length > 0 && (
          <div
            style={{
              ...badgeStyle,
              background: isSearchback ? 'rgba(245, 158, 11, 0.18)' : 'rgba(59, 130, 246, 0.18)',
              border: isSearchback ? '1px solid rgba(245, 158, 11, 0.45)' : '1px solid rgba(59, 130, 246, 0.45)',
              color: isSearchback ? '#fbbf24' : '#60a5fa',
            }}
            title="Currently selected beat index and detection confirmation"
          >
            <Radio size={12} />
            <span>Beat #{(currentBeat?.beat_index ?? selectedBeatIndex) + 1}/{delineation.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
