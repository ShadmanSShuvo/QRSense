import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Cpu, Activity, Sliders, ArrowRight } from 'lucide-react';

/**
 * AlgorithmPipelineBar
 *
 * Displays the 5-step Pan-Tompkins transformation pipeline in chronological order:
 * Raw ECG ➔ Bandpass ➔ Derivative ➔ Squaring ➔ Integration
 *
 * Includes progressive disclosure: a collapsible accordion for in-depth mathematical
 * equations, filter delays, and biological rationale.
 */
export default function AlgorithmPipelineBar({
  activeStage = 'original',
  setActiveStage = () => {},
  stageConfig = {},
  fs = 360,
  windowSize = 150,
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const stages = ['original', 'bandpass', 'derivative', 'squared', 'integrated'];
  const currentStageInfo = stageConfig[activeStage] || stageConfig.original;
  const currentSettings = currentStageInfo?.getSettings ? currentStageInfo.getSettings(fs, windowSize) : [];

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.88)',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '0.65rem 0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Row: Pipeline Stage Tabs + Info Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.6rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Stage Buttons Chain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            flexWrap: 'wrap',
            flex: 1,
          }}
        >
          {stages.map((stageKey, idx) => {
            const config = stageConfig[stageKey];
            if (!config) return null;
            const isActive = activeStage === stageKey;

            return (
              <React.Fragment key={stageKey}>
                <button
                  type="button"
                  onClick={() => setActiveStage(stageKey)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: isActive ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.65)',
                    border: isActive ? `1.5px solid ${config.color}` : '1px solid rgba(51, 65, 85, 0.8)',
                    borderRadius: '8px',
                    padding: '0.38rem 0.65rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? `0 0 10px ${config.color}33` : 'none',
                    userSelect: 'none',
                  }}
                  title={config.subtitle}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: config.color,
                      boxShadow: isActive ? `0 0 6px ${config.color}` : 'none',
                      opacity: isActive ? 1 : 0.6,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? config.color : '#cbd5e1',
                    }}
                  >
                    {config.title}
                  </span>
                </button>

                {/* Arrow Connector between pipeline stages */}
                {idx < stages.length - 1 && (
                  <ArrowRight
                    size={13}
                    style={{ color: '#475569', flexShrink: 0, margin: '0 0.1rem' }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Progressive Disclosure Toggle */}
        <button
          type="button"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: isDetailsOpen ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.6)',
            border: isDetailsOpen ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid #334155',
            color: isDetailsOpen ? '#38bdf8' : '#94a3b8',
            borderRadius: '6px',
            padding: '0.35rem 0.65rem',
            fontSize: '0.74rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
          title="Toggle scientific explanation and mathematical specifications for the selected stage"
        >
          <Info size={13} />
          <span>Stage Details &amp; Math</span>
          {isDetailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Collapsible Educational & Mathematical Section */}
      {isDetailsOpen && (
        <div
          style={{
            marginTop: '0.35rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(51, 65, 85, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {/* Header Info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  background: currentStageInfo.badgeColor,
                  color: currentStageInfo.color,
                  border: `1px solid ${currentStageInfo.color}44`,
                }}
              >
                {currentStageInfo.subtitle}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Pan-Tompkins (1985) Pipeline Specification
            </span>
          </div>

          {/* 3 Core Questions */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0.65rem',
              fontSize: '0.78rem',
              lineHeight: 1.45,
            }}
          >
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(51, 65, 85, 0.4)',
              }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: currentStageInfo.color,
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Info size={12} />
                1. What This Signal Represents
              </div>
              <div style={{ color: '#e2e8f0' }}>{currentStageInfo.represents}</div>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(51, 65, 85, 0.4)',
              }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: currentStageInfo.color,
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Cpu size={12} />
                2. Why Pan-Tompkins Uses It
              </div>
              <div style={{ color: '#e2e8f0' }}>{currentStageInfo.whyUsed}</div>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(51, 65, 85, 0.4)',
              }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: currentStageInfo.color,
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Activity size={12} />
                3. Contribution to QRS Detection
              </div>
              <div style={{ color: '#e2e8f0' }}>{currentStageInfo.detectionContribution}</div>
            </div>
          </div>

          {/* Numerical Settings Table */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.45rem',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '0.55rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(51, 65, 85, 0.4)',
            }}
          >
            {currentSettings.map((setting, i) => (
              <div key={i}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                  {setting.label}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.1rem' }}>
                  {setting.value}
                </div>
              </div>
            ))}
          </div>

          {/* Visual Moving-Window Graphic when on 'integrated' */}
          {activeStage === 'integrated' && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '8px',
                padding: '0.65rem 0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sliders size={13} />
                  Sliding Integrator Window: {windowSize} ms Duration
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Width N = {Math.round((windowSize / 1000) * fs)} samples
                </span>
              </div>

              <div
                style={{
                  position: 'relative',
                  height: '22px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '5px',
                  border: '1px solid rgba(51, 65, 85, 0.6)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, Math.max(10, (windowSize / 200) * 100))}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.25), rgba(16, 185, 129, 0.6))',
                    borderRight: '2px solid #10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  Sliding Integrator [{windowSize} ms • {Math.round((windowSize / 1000) * fs)} samples]
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
