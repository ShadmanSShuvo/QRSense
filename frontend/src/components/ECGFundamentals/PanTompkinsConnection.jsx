import React, { useState } from 'react';
import { Layers, ChevronRight, Activity, Zap } from 'lucide-react';
import { PAN_TOMPKINS_STAGES } from './ecgData';

/**
 * Renders the idealized waveform as it appears after each Pan-Tompkins stage.
 */
function StageWaveformSvg({ stageId, color }) {
  const baseline = 75; // in 400x150 viewBox

  switch (stageId) {
    case 'raw':
      // Raw ECG: P, QRS, T with slight baseline drift and minor noise
      return (
        <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
          {/* Baseline reference */}
          <line x1="0" y1={baseline} x2="400" y2={baseline} stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" />
          {/* Signal path */}
          <path
            d={`M 0 78 C 30 82, 50 74, 70 76 Q 85 64, 100 76 L 140 76 L 148 88 L 165 20 L 180 102 L 190 77 L 225 76 Q 255 52, 285 76 C 320 80, 360 74, 400 78`}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
          />
          {/* Wave annotations */}
          <text x="92" y="60" fill="#94a3b8" fontSize="10" fontWeight="bold">P</text>
          <text x="162" y="14" fill={color} fontSize="11" fontWeight="bold">QRS</text>
          <text x="252" y="48" fill="#94a3b8" fontSize="10" fontWeight="bold">T</text>
        </svg>
      );

    case 'bandpass':
      // Bandpass: Baseline flattened, high frequency filtered, P & T rounded/attenuated
      return (
        <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
          <line x1="0" y1={baseline} x2="400" y2={baseline} stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" />
          <path
            d={`M 0 ${baseline} L 75 ${baseline} Q 90 68, 105 ${baseline} L 142 ${baseline} L 150 86 L 165 24 L 180 98 L 188 ${baseline} L 235 ${baseline} Q 260 62, 285 ${baseline} L 400 ${baseline}`}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
          />
          <text x="92" y="63" fill="#64748b" fontSize="10">P (attenuated)</text>
          <text x="162" y="16" fill={color} fontSize="11" fontWeight="bold">Isolated QRS</text>
          <text x="250" y="56" fill="#64748b" fontSize="10">T (attenuated)</text>
        </svg>
      );

    case 'derivative':
      // Derivative: Flat waves -> 0. Q-R upstroke -> positive spike. R-S downstroke -> negative spike.
      return (
        <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
          <line x1="0" y1={baseline} x2="400" y2={baseline} stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" />
          <path
            d={`M 0 ${baseline} L 140 ${baseline} L 154 22 L 165 ${baseline} L 176 128 L 190 ${baseline} L 400 ${baseline}`}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
          />
          <text x="135" y="16" fill={color} fontSize="10" fontWeight="bold">+dV/dt (rising slope)</text>
          <text x="165" y="142" fill={color} fontSize="10" fontWeight="bold">-dV/dt (falling slope)</text>
          <text x="45" y={baseline - 8} fill="#64748b" fontSize="9">Zero slope (P &amp; T suppressed)</text>
        </svg>
      );

    case 'squaring':
      // Squaring: Non-negative, nonlinear separation of peaks
      return (
        <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
          <line x1="0" y1={120} x2="400" y2={120} stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" />
          <path
            d={`M 0 120 L 140 120 L 154 30 L 165 118 L 176 34 L 190 120 L 400 120`}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
          />
          <text x="130" y="22" fill={color} fontSize="10" fontWeight="bold">Upstroke²</text>
          <text x="175" y="24" fill={color} fontSize="10" fontWeight="bold">Downstroke²</text>
          <text x="12" y="112" fill="#64748b" fontSize="9">Strictly non-negative [y ≥ 0]</text>
        </svg>
      );

    case 'integration':
      // Moving-Window Integration: The dual spikes are smoothed into a single broad energy peak
      return (
        <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
          <line x1="0" y1={120} x2="400" y2={120} stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" />
          {/* Shaded integration peak */}
          <path
            d={`M 140 120 C 150 120, 155 35, 168 35 C 182 35, 195 120, 215 120 Z`}
            fill="rgba(16, 185, 129, 0.15)"
          />
          <path
            d={`M 0 120 L 140 120 C 150 120, 155 35, 168 35 C 182 35, 195 120, 215 120 L 400 120`}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
          />
          {/* Threshold line indicator */}
          <line x1="100" y1="75" x2="260" y2="75" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="268" y="78" fill="#fbbf24" fontSize="9" fontWeight="bold">Decision Threshold</text>
          <text x="145" y="26" fill={color} fontSize="10" fontWeight="bold">Consolidated QRS Energy Pulse</text>
        </svg>
      );

    default:
      return null;
  }
}

/**
 * Section: "Why does Pan-Tompkins care about the QRS complex?"
 * Explains the 5 sequential transformation stages with visual comparison.
 */
export default function PanTompkinsConnection({ onOpenWorkspace }) {
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);

  const activeStage = PAN_TOMPKINS_STAGES[selectedStageIndex];

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
          borderBottom: '1px solid #1e293b',
          paddingBottom: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.2rem',
            }}
          >
            <Layers size={13} />
            Signal Transformation Pipeline
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Why does Pan-Tompkins care about the QRS complex?
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
            Follow how each mathematical stage transforms physiological waves into an unambiguous detection peak.
          </p>
        </div>

        {onOpenWorkspace && (
          <button
            type="button"
            onClick={onOpenWorkspace}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Activity size={14} />
            Inspect Real Patient Data in Workspace
          </button>
        )}
      </div>

      {/* 5-Stage Step Navigation Pills */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.5rem',
        }}
      >
        {PAN_TOMPKINS_STAGES.map((stg, idx) => {
          const isSelected = idx === selectedStageIndex;
          return (
            <button
              key={stg.id}
              type="button"
              onClick={() => setSelectedStageIndex(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: isSelected ? `1.5px solid ${stg.color}` : '1px solid #1e293b',
                background: isSelected ? `${stg.color}18` : 'rgba(11, 17, 32, 0.6)',
                color: isSelected ? stg.color : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: isSelected ? stg.color : '#1e293b',
                  color: isSelected ? '#0f172a' : '#64748b',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {stg.step}
              </span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {stg.shortTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Interactive Showcase */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          alignItems: 'center',
          background: 'rgba(11, 17, 32, 0.85)',
          border: `1px solid ${activeStage.color}40`,
          borderRadius: '12px',
          padding: '1.25rem',
        }}
      >
        {/* Left: Interactive Waveform Graphic for this Stage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: activeStage.color }}>
              Stage {activeStage.step} of 5: {activeStage.title}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                color: '#cbd5e1',
              }}
            >
              {activeStage.mathFormula}
            </span>
          </div>

          <div
            style={{
              height: '160px',
              borderRadius: '8px',
              background: '#070b14',
              border: '1px solid #1e293b',
              padding: '0.5rem',
            }}
          >
            <StageWaveformSvg stageId={activeStage.id} color={activeStage.color} />
          </div>

          <div style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
            * Idealized representation demonstrating how signal morphology responds at this step.
          </div>
        </div>

        {/* Right: Explanatory Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Core Purpose
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.1rem' }}>
              {activeStage.purpose}
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            {activeStage.explanation}
          </p>

          <div
            style={{
              background: 'rgba(30, 41, 59, 0.45)',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
            }}
          >
            <strong style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'block', marginBottom: '0.2rem' }}>
              Waveform Effect:
            </strong>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45 }}>
              {activeStage.characteristics}
            </span>
          </div>

          {/* Quick next stage step button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
            <button
              type="button"
              onClick={() => setSelectedStageIndex((prev) => (prev + 1) % PAN_TOMPKINS_STAGES.length)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #334155',
                background: 'rgba(30, 41, 59, 0.6)',
                color: '#e2e8f0',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Next: {PAN_TOMPKINS_STAGES[(selectedStageIndex + 1) % PAN_TOMPKINS_STAGES.length].shortTitle}
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Culminating Algorithmic Principle Callout */}
      <div
        style={{
          background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '10px',
          padding: '0.9rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(56, 189, 248, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#38bdf8',
          }}
        >
          <Zap size={18} />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
            Core Takeaway
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.15rem' }}>
            The goal is not to diagnose every ECG abnormality. The goal is to reliably identify QRS complexes.
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            By focusing on slope and isolated frequency energy, Pan-Tompkins achieves high QRS detection accuracy across diverse morphologies.
          </div>
        </div>
      </div>
    </section>
  );
}
