import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import HeartModel from '../../HeartModel';
import { HeartPulse, Activity, Zap, RotateCcw } from 'lucide-react';

/**
 * Helper to format snake_case phase names to readable titles
 */
function formatPhase(phase) {
  if (!phase) return 'Isoelectric Baseline';
  switch (phase) {
    case 'atrial_activation':
    case 'atrial_conduction':
      return 'Atrial Depolarization (P-Wave)';
    case 'av_delay':
      return 'AV Nodal Conduction Delay (PR Segment)';
    case 'ventricular_conduction':
      return 'Ventricular Depolarization (QRS Complex)';
    case 'repolarization':
      return 'Ventricular Repolarization (T-Wave)';
    case 'diastole':
    default:
      return 'Ventricular Diastole & Recovery';
  }
}

/**
 * Return appropriate badge color for each cardiac phase
 */
function getPhaseColor(phase) {
  switch (phase) {
    case 'atrial_activation':
    case 'atrial_conduction':
      return '#38bdf8'; // Cyan
    case 'av_delay':
      return '#f59e0b'; // Amber
    case 'ventricular_conduction':
      return '#ef4444'; // Red pulse
    case 'repolarization':
      return '#a855f7'; // Purple
    case 'diastole':
    default:
      return '#10b981'; // Green
  }
}

/**
 * CardiacConductionPanel
 *
 * Dedicated physiological visualization companion.
 * In 'standard' and 'clean': renders as a dedicated vertical column (~360px wide).
 * In 'ecg-only': seamlessly shifts into a secondary horizontal panel below the ECG,
 * maintaining the Three.js Canvas mounted to avoid WebGL context loss.
 */
export default function CardiacConductionPanel({
  workspaceView = 'standard',
  playbackState = {},
  viewMode = 'workspace',
  cardStyle = {},
}) {
  const currentPhase = playbackState.phase || 'diastole';
  const phaseTitle = formatPhase(currentPhase);
  const phaseColor = getPhaseColor(currentPhase);
  const isHorizontal = workspaceView === 'ecg-only';

  return (
    <section
      className="card cardiac-conduction-panel"
      style={{
        ...cardStyle,
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        height: isHorizontal ? '310px' : '920px',
        maxHeight: isHorizontal ? '340px' : 'calc(100vh - 1.5rem)',
        position: isHorizontal ? 'relative' : 'sticky',
        top: isHorizontal ? 'auto' : '1.15rem',
        alignSelf: 'start',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'all 0.25s ease',
      }}
    >
      {/* 3D Heart Canvas Container */}
      <div
        style={{
          position: 'relative',
          width: isHorizontal ? '380px' : '100%',
          height: isHorizontal ? '100%' : '450px',
          minHeight: isHorizontal ? '100%' : '340px',
          flexShrink: 0,
          background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%)',
        }}
      >
        {/* Floating Header Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.85rem',
            right: '0.85rem',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <HeartPulse size={16} color="#fbbf24" />
            <span
              style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#fbbf24',
                textShadow: '0 2px 6px rgba(0,0,0,0.6)',
              }}
            >
              Live Cardiac Conduction
            </span>
          </div>

          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: `1px solid ${phaseColor}`,
              color: phaseColor,
              backdropFilter: 'blur(4px)',
            }}
          >
            {currentPhase.toUpperCase().replace('_', ' ')}
          </span>
        </div>

        {/* Three.js Canvas */}
        <Canvas
          frameloop={viewMode === 'workspace' ? 'always' : 'never'}
          camera={{
            position: [0, 0, 4.5],
            fov: 42,
          }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={1.15} />
          <directionalLight position={[5, 10, 7]} intensity={1.8} />
          <directionalLight position={[-5, -5, -3]} intensity={0.75} />
          <pointLight position={[0, 2, 4]} intensity={1.35} color="#ffffff" />

          <Suspense
            fallback={
              <mesh>
                <sphereGeometry args={[0.7, 16, 16]} />
                <meshStandardMaterial color="#b91c1c" wireframe transparent opacity={0.3} />
              </mesh>
            }
          >
            <HeartModel
              phase={playbackState.phase || 'diastole'}
              progress={playbackState.phaseProgress || 0}
            />
          </Suspense>

          <OrbitControls
            enableZoom={true}
            autoRotate={viewMode === 'workspace' && !playbackState.isPlaying}
            autoRotateSpeed={0.55}
            minDistance={2.9}
            maxDistance={6}
            target={[0, 0, 0]}
          />
        </Canvas>

        {/* Orbit hint badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.65rem',
            left: '0.85rem',
            zIndex: 10,
            fontSize: '0.65rem',
            color: '#94a3b8',
            background: 'rgba(15,23,42,0.75)',
            padding: '0.25rem 0.45rem',
            borderRadius: 6,
            pointerEvents: 'none',
          }}
        >
          Drag to rotate • Scroll to zoom
        </div>
      </div>

      {/* Conduction Pathway & ECG-to-Physiology Correlation */}
      <div
        style={{
          flex: 1,
          padding: '0.85rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '0.65rem',
          background: 'rgba(15, 23, 42, 0.65)',
          overflowY: 'auto',
          borderLeft: isHorizontal ? '1px solid rgba(51, 65, 85, 0.6)' : 'none',
          borderTop: isHorizontal ? 'none' : '1px solid rgba(51, 65, 85, 0.6)',
        }}
      >
        {/* Active Phase Display */}
        <div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
            Current Physiological Phase
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: phaseColor, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={15} />
            {phaseTitle}
          </div>
        </div>

        {/* ECG-to-Physiology Mapping Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            ECG Waveform ➔ Conduction Mapping
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isHorizontal ? 'repeat(3, 1fr)' : '1fr',
              gap: '0.45rem',
            }}
          >
            {/* P Wave */}
            <div
              style={{
                background: currentPhase === 'atrial_conduction' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                border: currentPhase === 'atrial_conduction' ? '1px solid #38bdf8' : '1px solid rgba(51, 65, 85, 0.4)',
                background:
                  currentPhase === 'atrial_activation' || currentPhase === 'atrial_conduction'
                    ? 'rgba(56, 189, 248, 0.22)'
                    : 'rgba(30, 41, 59, 0.4)',
                border:
                  currentPhase === 'atrial_activation' || currentPhase === 'atrial_conduction'
                    ? '1px solid #38bdf8'
                    : '1px solid rgba(51, 65, 85, 0.4)',
                boxShadow:
                  currentPhase === 'atrial_activation' || currentPhase === 'atrial_conduction'
                    ? '0 0 10px rgba(56, 189, 248, 0.35)'
                    : 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.65rem',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#38bdf8' }}>P Wave</div>
              <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginTop: '0.1rem' }}>
                SA Node firing ➔ Atrial depolarization
              </div>
            </div>

            {/* QRS Complex */}
            <div
              style={{
                background: currentPhase === 'ventricular_conduction' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                background: currentPhase === 'ventricular_conduction' ? 'rgba(239, 68, 68, 0.22)' : 'rgba(30, 41, 59, 0.4)',
                border: currentPhase === 'ventricular_conduction' ? '1px solid #ef4444' : '1px solid rgba(51, 65, 85, 0.4)',
                boxShadow: currentPhase === 'ventricular_conduction' ? '0 0 10px rgba(239, 68, 68, 0.35)' : 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.65rem',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f87171' }}>QRS Complex</div>
              <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginTop: '0.1rem' }}>
                His-Purkinje ➔ Ventricular depolarization
              </div>
            </div>

            {/* T Wave */}
            <div
              style={{
                background: currentPhase === 'repolarization' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                background: currentPhase === 'repolarization' ? 'rgba(168, 85, 247, 0.22)' : 'rgba(30, 41, 59, 0.4)',
                border: currentPhase === 'repolarization' ? '1px solid #a855f7' : '1px solid rgba(51, 65, 85, 0.4)',
                boxShadow: currentPhase === 'repolarization' ? '0 0 10px rgba(168, 85, 247, 0.35)' : 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.65rem',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#c084fc' }}>T Wave</div>
              <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginTop: '0.1rem' }}>
                Ventricular repolarization &amp; recovery
              </div>
            </div>
          </div>
        </div>

        {/* Anatomical Nodes Summary */}
        <div
          style={{
            fontSize: '0.68rem',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(51, 65, 85, 0.4)',
            paddingTop: '0.4rem',
            flexWrap: 'wrap',
            gap: '0.35rem',
          }}
        >
          <span>Pathway: <strong>SA</strong> ➔ <strong>AV</strong> ➔ <strong>His</strong> ➔ <strong>Purkinje</strong></span>
          <span style={{ color: '#10b981' }}>● Synchronized 3D Conduction</span>
        </div>
      </div>
    </section>
  );
}
