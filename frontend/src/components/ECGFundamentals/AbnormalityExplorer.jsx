import React, { useState, useMemo } from 'react';
import { AlertTriangle, ChevronRight, Zap } from 'lucide-react';
import { ABNORMALITY_DATA, DISCLAIMER_TEXT } from './ecgData';

/**
 * Mini SVG graphic clue illustrating the visual deviation from normal.
 */
function VisualClueSvg({ id }) {
  // 120x46 viewBox with standard baseline at y=28
  const baseline = 28;

  switch (id) {
    case 'abn_p_absent':
      // Fibrillatory ripples before QRS
      return (
        <svg viewBox="0 0 120 46" style={{ width: '100%', height: '100%' }}>
          <path
            d={`M 0 ${baseline} Q 10 26, 20 30 T 40 27 T 60 29 L 65 31 L 70 8 L 75 35 L 80 ${baseline} L 95 22 L 105 ${baseline} L 120 ${baseline}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.75"
          />
          <text x="25" y="16" fill="#f87171" fontSize="9" fontWeight="bold">No P</text>
        </svg>
      );

    case 'abn_p_flutter':
      // Sawtooth waves
      return (
        <svg viewBox="0 0 120 46" style={{ width: '100%', height: '100%' }}>
          <path
            d={`M 0 32 L 15 22 L 16 32 L 30 22 L 31 32 L 45 22 L 46 32 L 60 22 L 65 32 L 70 8 L 75 35 L 80 32 L 95 22 L 96 32 L 110 22 L 120 32`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.75"
          />
        </svg>
      );

    case 'abn_p_pulmonale':
      // Tall peaked P wave
      return (
        <svg viewBox="0 0 120 46" style={{ width: '100%', height: '100%' }}>
          {/* Peaked P wave */}
          <path
            d={`M 0 ${baseline} L 15 ${baseline} L 25 12 L 35 ${baseline} L 55 ${baseline} L 60 32 L 65 8 L 70 34 L 75 ${baseline} L 90 22 L 100 ${baseline} L 120 ${baseline}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.75"
          />
          <circle cx="25" cy="12" r="3" fill="#f59e0b" />
        </svg>
      );

    case 'abn_pr_prolonged':
      // Prolonged flat PR interval
      return (
        <svg viewBox="0 0 120 46" style={{ width: '100%', height: '100%' }}>
          <path
            d={`M 0 ${baseline} Q 10 20, 20 ${baseline} L 65 ${baseline} L 70 32 L 75 8 L 80 34 L 85 ${baseline} L 100 22 L 110 ${baseline} L 120 ${baseline}`}
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.75"
          />
          <line x1="20" y1="36" x2="65" y2="36" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
          <text x="32" y="44" fill="#f59e0b" fontSize="8" fontWeight="bold">&gt;200ms</text>
        </svg>
      );

    case 'abn_pr_short_delta':
      // Slurred delta wave upstroke
      return (
        <svg viewBox="0 0 120 46" style={{ width: '100%', height: '100%' }}>
          <path
            d={`M 0 ${baseline} Q 10 20, 20 ${baseline} L 30 ${baseline} C 36 28, 44 24, 48 18 L 54 8 L 60 34 L 65 ${baseline} L 85 22 L 95 ${baseline} L 120 ${baseline}`}
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.75"
          />
          <text x="30" y="16" fill="#ec4899" fontSize="8" fontWeight="bold">Delta</text>
        </svg>
      );

    case 'abn_qrs_wide_bbb':
      // Wide, notched QRS
      return (
        <svg viewBox="0 0 120 46" style={{ width: '100%', height: '100%' }}>
          <path
            d={`M 0 ${baseline} Q 12 21, 24 ${baseline} L 38 ${baseline} L 44 32 L 52 10 L 56 16 L 62 8 L 70 36 L 76 ${baseline} L 96 22 L 108 ${baseline} L 120 ${baseline}`}
            fill="none"
            stroke="#ec4899"
            strokeWidth="1.75"
          />
          <text x="44" y="44" fill="#ec4899" fontSize="8" fontWeight="bold">&gt;120ms</text>
        </svg>
      );

    case 'abn_qrs_pvc':
      // Wide bizarre PVC without P
      return (
        <svg viewBox="0 0 120 46" style={{ width: '100%', height: '100%' }}>
          <path
            d={`M 0 ${baseline} L 20 ${baseline} C 28 36, 35 42, 45 4 L 56 42 C 65 38, 75 14, 82 22 L 90 ${baseline} L 120 ${baseline}`}
            fill="none"
            stroke="#ec4899"
            strokeWidth="2"
          />
          <text x="36" y="12" fill="#f87171" fontSize="8" fontWeight="bold">PVC</text>
        </svg>
      );

    case 'abn_qrs_path_q':
      // Deep wide Q wave
      return (
        <svg viewBox="0 0 120 46" style={{ width: '100%', height: '100%' }}>
          <path
            d={`M 0 ${baseline} Q 10 20, 20 ${baseline} L 40 ${baseline} L 44 42 L 52 42 L 60 12 L 65 32 L 70 ${baseline} L 90 22 L 100 ${baseline} L 120 ${baseline}`}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.75"
          />
          <text x="36" y="44" fill="#fbbf24" fontSize="8" fontWeight="bold">Q wave</text>
        </svg>
      );

    case 'abn_st_elevation':
      // ST elevation (elevated J point)
      return (
        <svg viewBox="0 0 120 46" style={{ width: '100%', height: '100%' }}>
          <path
            d={`M 0 ${baseline} Q 10 20, 20 ${baseline} L 40 ${baseline} L 44 32 L 50 8 L 56 22 C 64 20, 72 16, 80 18 L 88 28 L 120 ${baseline}`}
            fill="none"
            stroke="#a855f7"
            strokeWidth="1.75"
          />
          <line x1="56" y1={baseline} x2="80" y2={baseline} stroke="#475569" strokeDasharray="2 2" strokeWidth="1" />
          <text x="60" y="12" fill="#ef4444" fontSize="8" fontWeight="bold">ST ↑</text>
        </svg>
      );

    case 'abn_st_depression':
      // ST depression
      return (
        <svg viewBox="0 0 120 46" style={{ width: '100%', height: '100%' }}>
          <path
            d={`M 0 ${baseline} Q 10 20, 20 ${baseline} L 40 ${baseline} L 44 32 L 50 8 L 56 36 L 74 36 L 82 24 L 90 ${baseline} L 120 ${baseline}`}
            fill="none"
            stroke="#a855f7"
            strokeWidth="1.75"
          />
          <line x1="56" y1={baseline} x2="74" y2={baseline} stroke="#475569" strokeDasharray="2 2" strokeWidth="1" />
          <text x="60" y="44" fill="#a855f7" fontSize="8" fontWeight="bold">ST ↓</text>
        </svg>
      );

    case 'abn_t_tall_peaked':
      // Narrow peaked T wave
      return (
        <svg viewBox="0 0 120 46" style={{ width: '100%', height: '100%' }}>
          <path
            d={`M 0 ${baseline} Q 10 20, 20 ${baseline} L 40 ${baseline} L 44 32 L 50 8 L 56 32 L 62 ${baseline} L 72 ${baseline} L 82 6 L 92 ${baseline} L 120 ${baseline}`}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.75"
          />
          <circle cx="82" cy="6" r="3" fill="#10b981" />
        </svg>
      );

    case 'abn_qt_prolonged':
      // Long QT
      return (
        <svg viewBox="0 0 120 46" style={{ width: '100%', height: '100%' }}>
          <path
            d={`M 0 ${baseline} Q 10 20, 20 ${baseline} L 35 ${baseline} L 40 32 L 45 8 L 50 32 L 55 ${baseline} L 85 ${baseline} Q 95 16, 105 ${baseline} L 120 ${baseline}`}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.75"
          />
          <line x1="40" y1="38" x2="105" y2="38" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="2 2" />
          <text x="62" y="44" fill="#06b6d4" fontSize="8" fontWeight="bold">Long QT</text>
        </svg>
      );

    default:
      return null;
  }
}

/**
 * Compact Abnormality Explorer.
 * Uses category tabs [All] [P] [PR] [QRS] [ST] [T/QT] to prevent visual overload.
 */
export default function AbnormalityExplorer() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedAbnormalityId, setSelectedAbnormalityId] = useState('abn_qrs_wide_bbb');

  const categories = [
    { id: 'ALL', label: 'All Findings' },
    { id: 'P', label: 'P Wave' },
    { id: 'PR', label: 'PR Interval' },
    { id: 'QRS', label: 'QRS Complex' },
    { id: 'ST', label: 'ST Segment' },
    { id: 'T_QT', label: 'T & QT' },
  ];

  const filteredItems = useMemo(() => {
    if (activeCategory === 'ALL') return ABNORMALITY_DATA;
    return ABNORMALITY_DATA.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const activeItem =
    ABNORMALITY_DATA.find((item) => item.id === selectedAbnormalityId) || filteredItems[0] || ABNORMALITY_DATA[0];

  return (
    <section
      className="card"
      style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid #1e293b',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderBottom: '1px solid #1e293b',
          paddingBottom: '0.75rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            Waveform Abnormality Atlas
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.15rem 0 0 0' }}>
            Recognizing morphological deviations and their impact on QRS detection
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  // Auto-select first in new category if needed
                  const inCat = cat.id === 'ALL'
                    ? ABNORMALITY_DATA[0]
                    : ABNORMALITY_DATA.find((i) => i.category === cat.id);
                  if (inCat) setSelectedAbnormalityId(inCat.id);
                }}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid #1e293b',
                  background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  color: isSelected ? '#38bdf8' : '#94a3b8',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Left Compact List + Right Detail Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1rem',
          alignItems: 'start',
        }}
      >
        {/* Left: Compact List of Findings in Active Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
          {filteredItems.map((item) => {
            const isSelected = item.id === activeItem.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedAbnormalityId(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: isSelected ? '1.5px solid #38bdf8' : '1px solid #1e293b',
                  background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(11, 17, 32, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Mini Visual Clue Thumbnail */}
                <div
                  style={{
                    width: '68px',
                    height: '34px',
                    borderRadius: '6px',
                    background: '#070b14',
                    border: '1px solid #1e293b',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <VisualClueSvg id={item.id} />
                </div>

                {/* Finding Title & Category Badge */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.1rem 0.35rem',
                        borderRadius: '4px',
                        background: 'rgba(51, 65, 85, 0.6)',
                        color: '#cbd5e1',
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: isSelected ? '#38bdf8' : '#e2e8f0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.title}
                  </div>
                </div>

                <ChevronRight size={14} color={isSelected ? '#38bdf8' : '#475569'} />
              </div>
            );
          })}
        </div>

        {/* Right: Focused Detail Card for Selected Finding */}
        <div
          style={{
            background: 'rgba(11, 17, 32, 0.85)',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '1.15rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {/* Header */}
          <div style={{ borderBottom: '1px solid #1e293b', paddingBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                }}
              >
                {activeItem.badge}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Category: [{activeItem.category}]
              </span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              {activeItem.title}
            </h3>
          </div>

          {/* Large Visual Diagram Preview */}
          <div
            style={{
              height: '65px',
              borderRadius: '8px',
              background: '#070b14',
              border: '1px solid #1e293b',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '180px', height: '100%' }}>
              <VisualClueSvg id={activeItem.id} />
            </div>
          </div>

          {/* Content points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem' }}>
            <div>
              <strong style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem', marginBottom: '0.15rem' }}>
                WHAT CHANGES VISUALLY
              </strong>
              <span style={{ color: '#cbd5e1', lineHeight: 1.45 }}>
                {activeItem.visualDescription}
              </span>
            </div>

            <div>
              <strong style={{ color: '#f59e0b', display: 'block', fontSize: '0.72rem', marginBottom: '0.15rem' }}>
                POSSIBLE CLINICAL ASSOCIATIONS
              </strong>
              <span style={{ color: '#cbd5e1', lineHeight: 1.45 }}>
                {activeItem.possibleAssociations}
              </span>
            </div>

            <div>
              <strong style={{ color: '#38bdf8', display: 'block', fontSize: '0.72rem', marginBottom: '0.15rem' }}>
                WHY IT MATTERS
              </strong>
              <span style={{ color: '#cbd5e1', lineHeight: 1.45 }}>
                {activeItem.whyItMatters}
              </span>
            </div>

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '8px',
                padding: '0.55rem 0.75rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#34d399',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  marginBottom: '0.15rem',
                }}
              >
                <Zap size={12} />
                Pan-Tompkins Detection Impact
              </div>
              <span style={{ color: '#a7f3d0', fontSize: '0.78rem', lineHeight: 1.4 }}>
                {activeItem.panTompkinsImpact}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Educational Disclaimer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.65rem 0.85rem',
          borderRadius: '8px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          color: '#fbbf24',
          fontSize: '0.78rem',
        }}
      >
        <AlertTriangle size={15} style={{ flexShrink: 0 }} />
        <span>{DISCLAIMER_TEXT}</span>
      </div>
    </section>
  );
}
