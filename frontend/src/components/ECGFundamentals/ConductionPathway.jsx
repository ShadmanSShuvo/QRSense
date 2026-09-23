import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Box } from 'lucide-react';
import { CONDUCTION_PATHWAY } from './ecgData';

/**
 * Simplified Cardiac Conduction Pathway.
 * Visualizes the electrical sequence:
 * SA Node -> Atria -> AV Node -> His-Purkinje -> Ventricles
 * mapped to P -> PR -> QRS.
 */
export default function ConductionPathway({ onOpenWorkspace }) {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Subtle cyclic animation through the 5 steps when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 5 ? 1 : prev + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentItem = CONDUCTION_PATHWAY.find((c) => c.step === activeStep) || CONDUCTION_PATHWAY[0];

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
      {/* Header */}
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
            Cardiac Conduction Pathway
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.15rem 0 0 0' }}>
            Tracing the electrical impulse from pacemaker to ventricular contraction
          </p>
        </div>

        {/* Playback & 3D Bridge Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #334155',
              background: isPlaying ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
              color: isPlaying ? '#38bdf8' : '#e2e8f0',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? 'Pause Sequence' : 'Animate Pathway'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setActiveStep(1);
            }}
            title="Reset to SA Node"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: '1px solid #334155',
              background: 'rgba(30, 41, 59, 0.6)',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={12} />
          </button>

          {onOpenWorkspace && (
            <button
              type="button"
              onClick={onOpenWorkspace}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                background: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Box size={13} />
              Open 3D Heart Visualizer
            </button>
          )}
        </div>
      </div>

      {/* Pathway Flow Tiles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.65rem',
        }}
      >
        {CONDUCTION_PATHWAY.map((node) => {
          const isActive = node.step === activeStep;
          return (
            <div
              key={node.id}
              onClick={() => {
                setIsPlaying(false);
                setActiveStep(node.step);
              }}
              style={{
                padding: '0.75rem',
                borderRadius: '10px',
                border: isActive ? `1.5px solid ${node.color}` : '1px solid #1e293b',
                background: isActive ? `${node.color}15` : 'rgba(11, 17, 32, 0.6)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                position: 'relative',
              }}
            >
              {/* Step indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: isActive ? node.color : '#64748b',
                  }}
                >
                  Step {node.step}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    background: `${node.color}20`,
                    color: node.color,
                    fontWeight: 600,
                  }}
                >
                  {node.ecgPhase}
                </span>
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                {node.name}
              </div>

              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {node.role}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Step Physiological Sync Card */}
      <div
        style={{
          background: 'rgba(11, 17, 32, 0.7)',
          border: `1px solid ${currentItem.color}40`,
          borderRadius: '10px',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: currentItem.color,
                boxShadow: `0 0 8px ${currentItem.color}`,
              }}
            />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
              {currentItem.name} — {currentItem.role}
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
            {currentItem.description}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '0.45rem 0.75rem',
          }}
        >
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ECG Correlate:</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: currentItem.color }}>
            {currentItem.ecgPhase}
          </span>
        </div>
      </div>
    </section>
  );
}
