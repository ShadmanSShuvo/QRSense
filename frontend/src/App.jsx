const API_URL = import.meta.env.VITE_API_URL;
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Activity,
  BookOpen,
  Award,
  HeartPulse,
} from 'lucide-react';
import { usePlaybackEngine } from './playback/usePlaybackEngine';
import PlaybackControls from './components/Playback/PlaybackControls';
import ECGPlot from './components/ECGPlot/ECGPlot';
import PlaybackCursor from './components/ECGPlot/PlaybackCursor';
import WorkspaceSidebar from './components/Workspace/WorkspaceSidebar';
import DiagnosticBar from './components/Workspace/DiagnosticBar';
import AlgorithmPipelineBar from './components/Workspace/AlgorithmPipelineBar';
import BeatInspectionPanel from './components/Workspace/BeatInspectionPanel';
import CardiacConductionPanel from './components/Workspace/CardiacConductionPanel';
import EvaluationPanel from './components/Evaluation/EvaluationPanel';
import DocumentationPanel from './components/Documentation/DocumentationPanel';
import ECGFundamentals from './components/ECGFundamentals/ECGFundamentals';
import './index.css';

const DURATION = 10; // seconds

/**
 * Educational & Algorithmic metadata for each Pan-Tompkins stage.
 * Based faithfully on the original 1985 Pan-Tompkins publication.
 */
const STAGE_CONFIG = {
  original: {
    title: 'Original',
    subtitle: 'Raw ECG signal',
    color: '#3b82f6',
    badgeColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3b82f6',
    represents:
      'The raw lead electrocardiogram voltage recording (e.g., MIT-BIH Lead II / MLII) digitized at the patient acquisition rate.',
    whyUsed:
      'Serves as the clinical ground truth and morphological reference signal. Detected QRS complexes are mapped back here for true fiducial localization and beat delineation.',
    detectionContribution:
      'Provides true physiological amplitude, baseline voltage, and polarity. Pan-Tompkins aligns candidate events to this signal for final R-peak confirmation and T-wave discrimination.',
    getSettings: (fs, _winMs) => [
      { label: 'Sampling Rate (fs)', value: `${fs} Hz` },
      { label: 'Signal Duration', value: `${DURATION} s (${fs * DURATION} samples)` },
      { label: 'Processing Delay', value: '0 ms (0 samples)' },
      { label: 'Signal Range', value: 'Raw Lead II / MLII voltage (mV)' },
    ],
  },
  bandpass: {
    title: 'Bandpass',
    subtitle: 'Noise-reduced ECG • approximately 5–15 Hz target',
    color: '#06b6d4',
    badgeColor: 'rgba(6, 182, 212, 0.2)',
    borderColor: '#06b6d4',
    represents:
      'The ECG signal filtered through cascaded second-order low-pass (~11 Hz) and high-pass (~5 Hz) digital filters to isolate the 5–15 Hz band.',
    whyUsed:
      'Attenuates baseline drift from respiration, high-frequency EMG muscle noise, and 60 Hz power-line interference while maximizing the signal-to-noise ratio in the frequency band of QRS energy.',
    detectionContribution:
      'Eliminates false triggers caused by respiratory sway and sharp muscle noise. Pan-Tompkins maintains a dedicated adaptive threshold pair (SPKF, NPKF, THRESHOLD_F1, THRESHOLD_F2) on this signal to verify QRS candidates.',
    getSettings: (fs, _winMs) => [
      { label: 'Sampling Rate (fs)', value: `${fs} Hz` },
      { label: 'Target Passband', value: '5.0 Hz – 15.0 Hz (~3 dB bandwidth)' },
      { label: 'Filter Delay', value: `~21 samples (~${((21 / fs) * 1000).toFixed(1)} ms group delay)` },
      { label: 'Bandpass Thresholds', value: 'SPKF / NPKF tracking (F1 primary, F2 search-back)' },
    ],
  },
  derivative: {
    title: 'Derivative',
    subtitle: 'QRS slope information',
    color: '#a855f7',
    badgeColor: 'rgba(168, 85, 247, 0.2)',
    borderColor: '#a855f7',
    represents:
      'First-order derivative of the bandpass-filtered signal computed via a 5-point central difference operator: y(n) = (1/8T)[2x(n) + x(n-1) - x(n-3) - 2x(n-4)].',
    whyUsed:
      'The QRS complex exhibits the steepest slopes (highest dV/dt) of the cardiac cycle. Differentiation heavily accentuates steep QRS transitions while suppressing flatter P and T waves.',
    detectionContribution:
      'Supplies high-fidelity slope information. It yields prominent positive and negative deflections for rapid Q-to-R and R-to-S deflections, acting as an effective high-slope detector.',
    getSettings: (fs, _winMs) => [
      { label: 'Sampling Rate (fs)', value: `${fs} Hz` },
      { label: 'Difference Equation', value: '5-Point Central Derivative: (1/8T)[2x(n)+x(n-1)-x(n-3)-2x(n-4)]' },
      { label: 'Operator Delay', value: `2 samples (~${((2 / fs) * 1000).toFixed(1)} ms; cumulative ~23 samples)` },
      { label: 'Extracted Feature', value: 'Steep dV/dt rising & falling edges' },
    ],
  },
  squared: {
    title: 'Squared',
    subtitle: 'Nonlinear slope enhancement',
    color: '#ec4899',
    badgeColor: 'rgba(236, 72, 153, 0.2)',
    borderColor: '#ec4899',
    represents:
      'Pointwise nonlinear squaring transformation: y(n) = [x(n)]² applied sample-by-sample to the derivative waveform.',
    whyUsed:
      'Enforces strict non-negativity across all deflections and nonlinearly magnifies large slope peaks relative to smaller residual background noise and baseline fluctuations.',
    detectionContribution:
      'Prevents negative deflections (such as deep S-waves or inverted QS complexes) from canceling and heavily widens the amplitude separation between QRS slope peaks and residual T-waves.',
    getSettings: (fs, _winMs) => [
      { label: 'Sampling Rate (fs)', value: `${fs} Hz` },
      { label: 'Transformation', value: 'Pointwise Nonlinear Squaring: y(n) = x(n)²' },
      { label: 'Additional Delay', value: '0 ms (0 samples) • Instantaneous operation' },
      { label: 'Dynamic Effect', value: 'Nonlinear high-slope emphasis' },
    ],
  },
  integrated: {
    title: 'Integrated',
    subtitle: 'QRS width + slope information',
    color: '#10b981',
    badgeColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
    represents:
      'Moving-window integrator averaging the squared derivative over an N-sample sliding window: y(n) = (1/N) * sum_{k=0}^{N-1} x(n - (N - 1) + k), where window width N spans approximately 150 ms.',
    whyUsed:
      'A differentiated QRS complex contains multiple sharp slope spikes. Moving integration blends these separate peaks into a single smooth, consolidated pulse containing both slope and duration information.',
    detectionContribution:
      'Produces the primary decision waveform used by the dual-threshold state machine (SPKI, NPKI, THRESHOLD_I1, THRESHOLD_I2) to identify QRS candidate intervals.',
    getSettings: (fs, winMs) => [
      { label: 'Sampling Rate (fs)', value: `${fs} Hz` },
      { label: 'Window Duration', value: `${winMs} ms (Pan-Tompkins standard ~150 ms)` },
      { label: 'Window Width (N)', value: `${Math.round((winMs / 1000) * fs)} samples` },
      {
        label: 'Integration Delay',
        value: `N/2 = ~${Math.round(((winMs / 1000) * fs) / 2)} samples (~${(winMs / 2).toFixed(1)} ms; total ~${(
          ((21 + 2 + Math.round(((winMs / 1000) * fs) / 2)) / fs) *
          1000
        ).toFixed(1)} ms)`,
      },
    ],
  },
};

function App() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState('100');
  const [windowSize, setWindowSize] = useState(150);
  const [lowcut, setLowcut] = useState(5.0);
  const [highcut, setHighcut] = useState(15.0);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('workspace'); // 'workspace' | 'evaluation'
  const [workspaceView, setWorkspaceView] = useState('standard'); // 'standard' | 'clean' | 'ecg-only'

  const [activeStage, setActiveStage] = useState('original');
  const [selectedBeatIndex, setSelectedBeatIndex] = useState(0);
  const [xRange, setXRange] = useState([0, DURATION]);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(true);
  const plotContainerRef = useRef(null);

  // Diagnostic overlay visibility toggles
  const [showRefractory, setShowRefractory] = useState(true);
  const [showSearchback, setShowSearchback] = useState(true);
  const [showRejectedT, setShowRejectedT] = useState(true);
  const [showThresholds, setShowThresholds] = useState(true);
  const [showDelineation, setShowDelineation] = useState(true);

  // Extract R-peaks and fs memoized to prevent unnecessary re-instantiations
  const rPeaks = useMemo(() => data?.stages?.peaks_original || [], [data?.stages?.peaks_original]);
  const fs = data?.fs || 360;

  // Centralized playback engine — single source of truth for timing + cardiac phase
  const [playbackState, playbackControls] = usePlaybackEngine({
    fs,
    rPeaks,
    duration: DURATION,
  });

  // Trigger Plotly canvas resize immediately when workspace view changes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 60);
    return () => clearTimeout(timer);
  }, [workspaceView]);

  // Synchronize selectedBeatIndex with playback engine position
  useEffect(() => {
    if (
      playbackState.beatIndex !== null &&
      playbackState.beatIndex !== undefined &&
      data?.delineation?.length
    ) {
      const bounded = Math.max(0, Math.min(data.delineation.length - 1, playbackState.beatIndex));
      setSelectedBeatIndex((prev) => (prev !== bounded ? bounded : prev));
    }
  }, [playbackState.beatIndex, data?.delineation?.length]);

  // Fetch available records on mount
  useEffect(() => {
    fetch(`${API_URL}/api/records`)
      .then((res) => res.json())
      .then((result) => {
        if (result.records && result.records.length > 0) {
          setRecords(result.records);
          setSelectedRecord(result.records[0]);
        }
      })
      .catch((err) => console.error('Failed to fetch records:', err));
  }, []);

  const processSignal = useCallback(async () => {
    setLoading(true);
    setError(null);
    playbackControls.stop();
    setSelectedBeatIndex(0);
    setXRange([0, DURATION]);

    try {
      const response = await fetch(`${API_URL}/api/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          record_id: selectedRecord,
          window_size_ms: windowSize,
          lowcut,
          highcut,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process signal');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedRecord, windowSize, lowcut, highcut, playbackControls]);

  useEffect(() => {
    if (records.length > 0) {
      processSignal();
    }
  }, [records, selectedRecord]);

  const focusBeat = useCallback(
    (idx) => {
      const beats = data?.delineation || [];
      const b = beats[idx];
      if (!b) return;
      const center = b.r_time !== null && b.r_time !== undefined
        ? b.r_time
        : (b.dominant_deflection_index ? b.dominant_deflection_index / fs : b.pt_qrs_index / fs);
      const halfWin = 0.35; // 350ms window
      setXRange([Math.max(0, center - halfWin), Math.min(DURATION, center + halfWin)]);
    },
    [data, fs]
  );

  const resetZoom = useCallback(() => {
    setXRange([0, DURATION]);
  }, []);

  const handleSelectBeat = useCallback(
    (idx, shouldSeek = true) => {
      if (!data?.delineation?.length) return;
      const boundedIdx = Math.max(0, Math.min(data.delineation.length - 1, idx));
      setSelectedBeatIndex(boundedIdx);
      focusBeat(boundedIdx);
      if (shouldSeek) {
        const b = data.delineation[boundedIdx];
        if (b) {
          const center =
            b.r_time !== null && b.r_time !== undefined
              ? b.r_time
              : (b.dominant_deflection_index ? b.dominant_deflection_index / fs : b.pt_qrs_index / fs);
          if (center !== undefined && !isNaN(center)) {
            playbackControls.seek(center);
          }
        }
      }
    },
    [data, fs, focusBeat, playbackControls]
  );

  const handlePrevBeat = useCallback(() => {
    if (!data?.delineation?.length) return;
    const prevIdx = Math.max(0, selectedBeatIndex - 1);
    handleSelectBeat(prevIdx, true);
  }, [data, selectedBeatIndex, handleSelectBeat]);

  const handleNextBeat = useCallback(() => {
    if (!data?.delineation?.length) return;
    const nextIdx = Math.min(data.delineation.length - 1, selectedBeatIndex + 1);
    handleSelectBeat(nextIdx, true);
  }, [data, selectedBeatIndex, handleSelectBeat]);

  const handlePlotClick = useCallback(
    (evt) => {
      if (!evt.points || evt.points.length === 0 || !data?.delineation?.length) return;
      const clickX = evt.points[0].x;
      let closestIdx = 0;
      let minDiff = Infinity;
      data.delineation.forEach((b, idx) => {
        const refTime =
          b.r_time !== null && b.r_time !== undefined
            ? b.r_time
            : (b.dominant_deflection_index ? b.dominant_deflection_index / fs : b.pt_qrs_index / fs);
        const diff = Math.abs(refTime - clickX);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      if (minDiff < 0.8) {
        handleSelectBeat(closestIdx, true);
      }
    },
    [data, fs, handleSelectBeat]
  );

  const handleRelayout = useCallback((event) => {
    if (event['xaxis.range[0]'] !== undefined && event['xaxis.range[1]'] !== undefined) {
      const newMin = Number(event['xaxis.range[0]']);
      const newMax = Number(event['xaxis.range[1]']);
      setXRange((prev) => {
        if (Math.abs(prev[0] - newMin) < 0.005 && Math.abs(prev[1] - newMax) < 0.005) {
          return prev;
        }
        return [newMin, newMax];
      });
    } else if (event['xaxis.autorange']) {
      setXRange([0, DURATION]);
    }
  }, []);

  const cardStyle = {
    background: 'var(--card-bg, #1b263b)',
    border: '1px solid var(--border-color, #334155)',
    borderRadius: '18px',
    minWidth: 0,
    boxSizing: 'border-box',
  };

  const currentStageInfo = STAGE_CONFIG[activeStage] || STAGE_CONFIG.original;
  const currentSettings = currentStageInfo.getSettings(fs, windowSize);

  return (
    <div className="app-container" style={{ minHeight: '100vh' }}>
      {/* ───────────────────────── Header ───────────────────────── */}
      <header
        className="header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '1.1rem',
        }}
      >
        <div>
          <h1 style={{ marginBottom: '0.2rem' }}>Pan-Tompkins Algorithm</h1>
          <p style={{ margin: 0 }}>Advanced QRS Detection &amp; Cardiac Conduction Visualization</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0, alignItems: 'center' }}>
          {/* Workspace Views Selector: Standard | Clean | ECG Only */}
          {viewMode === 'workspace' && (
            <div
              style={{
                display: 'inline-flex',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(51, 65, 85, 0.6)',
                borderRadius: '8px',
                padding: '0.25rem',
                gap: '0.25rem',
              }}
            >
              <button
                type="button"
                onClick={() => setWorkspaceView('standard')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.42rem 0.75rem',
                  borderRadius: '6px',
                  border: workspaceView === 'standard' ? '1px solid #38bdf8' : 'none',
                  background: workspaceView === 'standard' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: workspaceView === 'standard' ? '#38bdf8' : '#94a3b8',
                  fontWeight: workspaceView === 'standard' ? 600 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Standard View: Full Laboratory (Sidebar, ECG, 3D Heart)"
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setWorkspaceView('clean')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.42rem 0.75rem',
                  borderRadius: '6px',
                  border: workspaceView === 'clean' ? '1px solid #38bdf8' : 'none',
                  background: workspaceView === 'clean' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: workspaceView === 'clean' ? '#38bdf8' : '#94a3b8',
                  fontWeight: workspaceView === 'clean' ? 600 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Clean View: ECG + 3D Heart without configuration clutter"
              >
                Clean
              </button>
              <button
                type="button"
                onClick={() => setWorkspaceView('ecg-only')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.42rem 0.75rem',
                  borderRadius: '6px',
                  border: workspaceView === 'ecg-only' ? '1px solid #38bdf8' : 'none',
                  background: workspaceView === 'ecg-only' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: workspaceView === 'ecg-only' ? '#38bdf8' : '#94a3b8',
                  fontWeight: workspaceView === 'ecg-only' ? 600 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="ECG Only View: Maximized ECG width with 3D Heart below"
              >
                ECG Only
              </button>
            </div>
          )}

          {/* Section Navigation Tabs */}
          <div
            style={{
              display: 'inline-flex',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(51, 65, 85, 0.6)',
              borderRadius: '8px',
              padding: '0.25rem',
              gap: '0.25rem',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('workspace')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: viewMode === 'workspace' ? '1px solid #38bdf8' : 'none',
                background: viewMode === 'workspace' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: viewMode === 'workspace' ? '#38bdf8' : '#94a3b8',
                fontWeight: viewMode === 'workspace' ? 600 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Activity size={15} />
              Interactive Workspace
            </button>
            <button
              type="button"
              onClick={() => {
                if (playbackState.isPlaying) playbackControls.pause();
                setViewMode('ecg-fundamentals');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: viewMode === 'ecg-fundamentals' ? '1px solid #38bdf8' : 'none',
                background: viewMode === 'ecg-fundamentals' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: viewMode === 'ecg-fundamentals' ? '#38bdf8' : '#94a3b8',
                fontWeight: viewMode === 'ecg-fundamentals' ? 600 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <HeartPulse size={15} />
              ECG Fundamentals
            </button>
            <button
              type="button"
              onClick={() => {
                if (playbackState.isPlaying) playbackControls.pause();
                setViewMode('evaluation');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: viewMode === 'evaluation' ? '1px solid #10b981' : 'none',
                background: viewMode === 'evaluation' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: viewMode === 'evaluation' ? '#34d399' : '#94a3b8',
                fontWeight: viewMode === 'evaluation' ? 600 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Award size={15} />
              Evaluation Benchmark
            </button>
            <button
              type="button"
              onClick={() => {
                if (playbackState.isPlaying) playbackControls.pause();
                setViewMode('docs');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: viewMode === 'docs' ? '1px solid #38bdf8' : 'none',
                background: viewMode === 'docs' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: viewMode === 'docs' ? '#38bdf8' : '#94a3b8',
                fontWeight: viewMode === 'docs' ? 600 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <BookOpen size={15} />
              Documentation
            </button>
          </div>
        </div>
      </header>

      {/* ───────────────────────── Workspace Layout Grid (Supports Standard | Clean | ECG Only) ───────────────────────── */}
      <div
        className={`workspace-grid view-${workspaceView}`}
        style={{
          display: viewMode === 'workspace' ? 'grid' : 'none',
          gridTemplateColumns:
            workspaceView === 'standard'
              ? '230px minmax(0, 1fr) 360px'
              : workspaceView === 'clean'
              ? 'minmax(0, 1fr) 380px'
              : '54px minmax(0, 1fr)',
          gap: '1.15rem',
          alignItems: 'stretch',
          width: '100%',
        }}
      >
        {/* 1. Left Control Panel / Collapsible Rail */}
        <WorkspaceSidebar
          workspaceView={workspaceView}
          setWorkspaceView={setWorkspaceView}
          records={records}
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
          lowcut={lowcut}
          setLowcut={setLowcut}
          highcut={highcut}
          setHighcut={setHighcut}
          windowSize={windowSize}
          setWindowSize={setWindowSize}
          processSignal={processSignal}
          loading={loading}
          error={error}
          showRefractory={showRefractory}
          setShowRefractory={setShowRefractory}
          showSearchback={showSearchback}
          setShowSearchback={setShowSearchback}
          showRejectedT={showRejectedT}
          setShowRejectedT={setShowRejectedT}
          showThresholds={showThresholds}
          setShowThresholds={setShowThresholds}
          showDelineation={showDelineation}
          setShowDelineation={setShowDelineation}
          activeStage={activeStage}
          resetZoom={resetZoom}
          focusBeat={focusBeat}
          selectedBeatIndex={selectedBeatIndex}
          cardStyle={cardStyle}
        />

        {/* 2. Center Column: Dominant ECG Signal Protagonist */}
        <main
          className="center-workspace"
          style={{
            gridColumn: workspaceView === 'clean' ? '1' : '2',
            gridRow: '1',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {/* Compact Diagnostic Strip */}
          <DiagnosticBar
            analysis={data?.analysis}
            stages={data?.stages}
            delineation={data?.delineation || []}
            selectedBeatIndex={selectedBeatIndex}
            workspaceView={workspaceView}
          />

          {/* Large Dominant ECG Plot */}
          <div
            ref={plotContainerRef}
            className="plot-container"
            style={{
              position: 'relative',
              height: workspaceView === 'ecg-only' ? 460 : 420,
              minHeight: 380,
              width: '100%',
              flexShrink: 0,
              overflow: 'hidden',
              borderRadius: '14px',
            }}
          >
            {loading && (
              <div className="loading-overlay">
                <Activity size={32} />
                <span>Processing Signal...</span>
              </div>
            )}
            <ECGPlot
              data={data}
              activeStage={activeStage}
              selectedBeatIndex={selectedBeatIndex}
              showRefractory={showRefractory}
              showSearchback={showSearchback}
              showRejectedT={showRejectedT}
              showThresholds={showThresholds}
              showDelineation={showDelineation}
              windowSize={windowSize}
              fs={fs}
              xRange={xRange}
              selectedRecord={selectedRecord}
              stageConfig={STAGE_CONFIG}
              onPlotClick={handlePlotClick}
              onRelayout={handleRelayout}
            />
            <PlaybackCursor
              currentTime={playbackState.currentTime}
              xRange={xRange}
              containerRef={plotContainerRef}
            />
          </div>

          {/* Horizontal Playback Transport Directly Underneath ECG Plot */}
          <PlaybackControls
            state={playbackState}
            controls={playbackControls}
            duration={DURATION}
            totalBeats={rPeaks.length}
          />

          {/* Compact Algorithm Transformation Pipeline */}
          <AlgorithmPipelineBar
            activeStage={activeStage}
            setActiveStage={setActiveStage}
            stageConfig={STAGE_CONFIG}
            fs={fs}
            windowSize={windowSize}
          />

          {/* Inspected Beat Morphology & Progressive Evidence */}
          <BeatInspectionPanel
            data={data}
            selectedBeatIndex={selectedBeatIndex}
            setSelectedBeatIndex={handleSelectBeat}
            activeStage={activeStage}
            fs={fs}
            focusBeat={focusBeat}
            resetZoom={resetZoom}
            cardStyle={cardStyle}
          />
        </main>

        {/* 3. Physiological Companion: 3D Cardiac Conduction (Right in Standard/Clean, Below in ECG Only) */}
        <div
          style={{
            gridColumn:
              workspaceView === 'standard'
                ? '3'
                : workspaceView === 'clean'
                ? '2'
                : '2',
            gridRow: workspaceView === 'ecg-only' ? '2' : '1',
            width: '100%',
            minWidth: 0,
          }}
        >
          <CardiacConductionPanel
            workspaceView={workspaceView}
            playbackState={playbackState}
            viewMode={viewMode}
            cardStyle={cardStyle}
          />
        </div>
      </div>

      {/* ───────────────────────── Interactive ECG Fundamentals Educational Panel ───────────────────────── */}
      {viewMode === 'ecg-fundamentals' && (
        <div style={{ width: '100%', margin: '0 auto' }}>
          <ECGFundamentals onOpenWorkspace={() => setViewMode('workspace')} />
        </div>
      )}

      {/* ───────────────────────── Dedicated Evaluation Benchmark Panel ───────────────────────── */}
      {viewMode === 'evaluation' && (
        <div style={{ width: '100%', margin: '0 auto' }}>
          <EvaluationPanel
            currentRecordId={selectedRecord}
            availableRecords={records}
            detectorParams={{ windowSizeMs: windowSize, lowcut, highcut }}
          />
        </div>
      )}

      {/* ───────────────────────── In-App Technical Documentation Panel ───────────────────────── */}
      {viewMode === 'docs' && (
        <div style={{ width: '100%', margin: '0 auto' }}>
          <DocumentationPanel
            onBack={() => setViewMode('workspace')}
            onOpenEvaluation={() => {
              if (playbackState.isPlaying) playbackControls.pause();
              setViewMode('evaluation');
            }}
          />
        </div>
      )}

      {/* Responsive layout overrides */}
      <style>{`
        @media (max-width: 1280px) {
          .workspace-grid.view-standard {
            grid-template-columns: 210px minmax(0, 1fr) 320px !important;
          }
        }

        @media (max-width: 1024px) {
          .workspace-grid.view-standard {
            grid-template-columns: 200px minmax(0, 1fr) !important;
          }

          .workspace-grid.view-standard > div:last-child {
            grid-column: 1 / -1 !important;
          }

          .workspace-grid.view-clean {
            grid-template-columns: minmax(0, 1fr) !important;
          }

          .workspace-grid.view-clean > div:last-child {
            grid-column: 1 / -1 !important;
          }
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            align-items: flex-start !important;
          }

          .workspace-grid.view-standard,
          .workspace-grid.view-clean,
          .workspace-grid.view-ecg-only {
            grid-template-columns: 1fr !important;
          }

          .workspace-grid.view-standard > aside,
          .workspace-grid.view-clean > aside,
          .workspace-grid.view-ecg-only > aside {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
