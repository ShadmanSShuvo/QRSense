import React, { useState } from 'react';
import { Info, Zap, HeartPulse } from 'lucide-react';
import ECGWaveform from './ECGWaveform';
import { WAVEFORM_COMPONENTS } from './ecgData';

/**
 * Hero Section: Visual Centerpiece of ECG Fundamentals.
 * Features the large interactive ECG waveform and a single dedicated
 * reusable inspection panel updating on click/hover.
 */
export default function HeroSection() {
  const [selectedId, setSelectedId] = useState('r_wave');
  const [hoveredId, setHoveredId] = useState(null);

  const activeId = hoveredId || selectedId;
  const activeComponent = WAVEFORM_COMPONENTS[activeId] || WAVEFORM_COMPONENTS.r_wave;

  const selectorButtons = [
    { id: 'p_wave', label: 'P Wave' },
    { id: 'pr_interval', label: 'PR Interval' },
    { id: 'q_wave', label: 'Q Wave' },
    { id: 'r_wave', label: 'R Wave' },
    { id: 's_wave', label: 'S Wave' },
    { id: 'qrs_complex', label: 'QRS Complex' },
    { id: 'st_segment', label: 'ST Segment' },
    { id: 't_wave', label: 'T Wave' },
    { id: 'qt_interval', label: 'QT Interval' },
  ];

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* ── Title & Subtitle ── */}
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.25rem 0.75rem',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '20px',
            color: '#38bdf8',
            fontSize: '0.78rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.65rem',
          }}
        >
          <HeartPulse size={14} />
          Educational Interactive Module
        </div>
        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            marginBottom: '0.4rem',
          }}
        >
          ECG Fundamentals
        </h1>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '1.05rem',
            maxWidth: '650px',
            margin: '0 auto',
          }}
        >
          Understand the electrical story behind every QRS complex.
        </p>
      </div>

      {/* ── Visual Centerpiece: Interactive Waveform & Active Inspector ── */}
      <div
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
          boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Top Header of the Waveform Box */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: activeComponent.color,
                boxShadow: `0 0 10px ${activeComponent.color}`,
              }}
            />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>
              Lead II Idealized Cardiac Cycle
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              • Click or hover any component to inspect
            </span>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', gap: '0.5rem' }}>
            <span style={{ color: activeComponent.color, fontWeight: 600 }}>
              Viewing: {activeComponent.name}
            </span>
          </div>
        </div>

        {/* 1. Large SVG Waveform */}
        <ECGWaveform
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
          hoveredId={hoveredId}
          onHover={(id) => setHoveredId(id)}
        />

        {/* 2. Component Selector Chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.45rem',
            justifyContent: 'center',
            padding: '0.25rem 0',
          }}
        >
          {selectorButtons.map((btn) => {
            const isSelected = selectedId === btn.id;
            const isHovered = hoveredId === btn.id;
            const comp = WAVEFORM_COMPONENTS[btn.id];
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSelectedId(btn.id)}
                onMouseEnter={() => setHoveredId(btn.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  border: isSelected
                    ? `1px solid ${comp.color}`
                    : isHovered
                    ? '1px solid rgba(148, 163, 184, 0.4)'
                    : '1px solid #1e293b',
                  background: isSelected
                    ? `${comp.color}22`
                    : isHovered
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(15, 23, 42, 0.6)',
                  color: isSelected ? comp.color : '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: comp.color,
                  }}
                />
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* 3. Single Reusable Inspection Panel */}
        <div
          style={{
            background: 'rgba(11, 17, 32, 0.85)',
            border: `1px solid ${activeComponent.color}44`,
            borderRadius: '12px',
            padding: '1.15rem 1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            position: 'relative',
            transition: 'border-color 0.25s ease',
          }}
        >
          {/* Column A: Physiological Overview & Reference Range */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  background: `${activeComponent.color}25`,
                  color: activeComponent.color,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {activeComponent.anatomicalPhase}
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                {activeComponent.name}
              </h3>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              {activeComponent.physiologicalMeaning}
            </p>

            <div
              style={{
                fontSize: '0.78rem',
                color: '#94a3b8',
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #1e293b',
              }}
            >
              <strong style={{ color: '#e2e8f0' }}>Reference Range: </strong>
              {activeComponent.typicalRange}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              <strong style={{ color: '#94a3b8' }}>Conduction: </strong>
              {activeComponent.conductionOrigin}
            </div>
          </div>

          {/* Column B: Clinical Relevance & Pan-Tompkins Impact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {/* Clinical context */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(51, 65, 85, 0.5)',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#f59e0b',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '0.25rem',
                }}
              >
                <Info size={13} />
                Clinical Context
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
                {activeComponent.clinicalSignificance}
              </p>
            </div>

            {/* Relationship to Pan-Tompkins */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#34d399',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '0.25rem',
                }}
              >
                <Zap size={13} />
                Pan-Tompkins Detection Impact
              </div>
              <p style={{ fontSize: '0.8rem', color: '#a7f3d0', margin: 0, lineHeight: 1.45 }}>
                {activeComponent.panTompkinsRelevance}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
