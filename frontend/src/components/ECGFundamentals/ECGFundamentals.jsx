import React, { useRef } from 'react';
import {
  Activity,
  HeartPulse,
} from 'lucide-react';
import HeroSection from './HeroSection';
import ConductionPathway from './ConductionPathway';
import AbnormalityExplorer from './AbnormalityExplorer';
import PanTompkinsConnection from './PanTompkinsConnection';
import ECGLab from './ECGLab';

/**
 * Master ECGFundamentals Component.
 * Educational interactive module embedded within the Pan-Tompkins platform.
 */
export default function ECGFundamentals({ onOpenWorkspace }) {
  const waveformRef = useRef(null);
  const conductionRef = useRef(null);
  const abnormalitiesRef = useRef(null);
  const panTompkinsRef = useRef(null);
  const labRef = useRef(null);

  const scrollTo = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: 'Waveform Anatomy', ref: waveformRef },
    { label: 'Cardiac Conduction', ref: conductionRef },
    { label: 'Abnormality Atlas', ref: abnormalitiesRef },
    { label: 'Pan-Tompkins Connection', ref: panTompkinsRef },
    { label: 'Interactive ECG Lab', ref: labRef },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '0 0.5rem 3rem 0.5rem',
        color: '#f8fafc',
      }}
    >
      {/* ── Sub-navigation Quick Jump Bar ── */}
      <nav
        aria-label="Module sections"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '0.65rem 1rem',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: '0.5rem',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HeartPulse size={16} color="#38bdf8" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
            ECG Educational Module
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => scrollTo(link.ref)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#38bdf8';
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

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
              border: '1px solid #334155',
              background: 'rgba(30, 41, 59, 0.6)',
              color: '#e2e8f0',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Activity size={13} />
            Back to Workspace
          </button>
        )}
      </nav>

      {/* ── Section 1: Hero & Visual Centerpiece Waveform ── */}
      <div ref={waveformRef}>
        <HeroSection />
      </div>

      {/* ── Section 2: Simplified Cardiac Conduction Pathway ── */}
      <div ref={conductionRef}>
        <ConductionPathway onOpenWorkspace={onOpenWorkspace} />
      </div>

      {/* ── Section 3: Compact Waveform Abnormality Atlas ── */}
      <div ref={abnormalitiesRef}>
        <AbnormalityExplorer />
      </div>

      {/* ── Section 4: Pan-Tompkins Connection (QRS Transformation) ── */}
      <div ref={panTompkinsRef}>
        <PanTompkinsConnection onOpenWorkspace={onOpenWorkspace} />
      </div>

      {/* ── Section 5: Interactive ECG Lab Simulator ── */}
      <div ref={labRef}>
        <ECGLab />
      </div>
    </div>
  );
}
