import React, { useState, useMemo } from 'react';
import { AlertTriangle, Info, CheckCircle2, Sliders, Zap } from 'lucide-react';
import { SIMULATOR_PRESETS, DISCLAIMER_TEXT } from './ecgData';

/**
 * 2nd-order IIR Bandpass filter (Butterworth approximation 5-15 Hz at fs Hz)
 */
function applyBandpass(signal, fs, lowcut = 5.0, highcut = 15.0) {
  const n = signal.length;
  const filtered = new Float64Array(n);

  // Digital 2nd-order IIR bandpass coefficients calculation
  const nyquist = 0.5 * fs;
  const flow = lowcut / nyquist;
  const fhigh = highcut / nyquist;
  const w0 = Math.PI * (flow + fhigh) * 0.5;
  const bw = Math.PI * (fhigh - flow);
  const q = Math.sin(w0) / (2 * Math.sinh((Math.LN2 / 2) * bw * (w0 / Math.sin(w0))));

  const alpha = Math.sin(w0) / (2 * q);
  const b0 = alpha;
  const b1 = 0;
  const b2 = -alpha;
  const a0 = 1 + alpha;
  const a1 = -2 * Math.cos(w0);
  const a2 = 1 - alpha;

  const nb0 = b0 / a0;
  const nb1 = b1 / a0;
  const nb2 = b2 / a0;
  const na1 = a1 / a0;
  const na2 = a2 / a0;

  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;

  for (let i = 0; i < n; i++) {
    const x0 = signal[i];
    const y0 = nb0 * x0 + nb1 * x1 + nb2 * x2 - na1 * y1 - na2 * y2;
    filtered[i] = y0;
    x2 = x1;
    x1 = x0;
    y2 = y1;
    y1 = y0;
  }

  return filtered;
}

/**
 * 5-point central derivative filter:
 * y[n] = (1 / 8T) * (2x[n] + x[n-1] - x[n-3] - 2x[n-4])
 */
function applyDerivative(signal, fs) {
  const n = signal.length;
  const deriv = new Float64Array(n);
  const scale = fs / 8.0;

  for (let i = 4; i < n; i++) {
    deriv[i] = scale * (2 * signal[i] + signal[i - 1] - signal[i - 3] - 2 * signal[i - 4]);
  }
  return deriv;
}

/**
 * Pointwise Squaring: y[n] = x[n]^2
 */
function applySquaring(signal) {
  const n = signal.length;
  const squared = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    squared[i] = signal[i] * signal[i];
  }
  return squared;
}

/**
 * Moving Window Integration: y[n] = (1/N) * sum_{k=0}^{N-1} x[n - k]
 */
function applyIntegration(signal, fs, winMs = 150) {
  const n = signal.length;
  const integrated = new Float64Array(n);
  const winSize = Math.max(1, Math.round((winMs / 1000.0) * fs));

  let currentSum = 0;
  for (let i = 0; i < n; i++) {
    currentSum += signal[i];
    if (i >= winSize) {
      currentSum -= signal[i - winSize];
      integrated[i] = currentSum / winSize;
    } else {
      integrated[i] = currentSum / (i + 1);
    }
  }
  return integrated;
}

/**
 * Synthetic waveform generator for teaching presets
 */
function generateSyntheticTrace(presetId, fs, durationSec) {
  const totalSamples = Math.round(fs * durationSec);
  const raw = new Float64Array(totalSamples);
  const time = new Float64Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    time[i] = i / fs;
  }

  let beatTimes = [];
  let isAfib = false;
  let isPvc = false;
  let isStElev = false;
  let isTallT = false;

  switch (presetId) {
    case 'afib':
      isAfib = true;
      beatTimes = [0.45, 1.05, 1.85, 2.45, 3.25];
      break;
    case 'pvc':
      isPvc = true;
      // Normal beat at 0.55, early wide PVC at 1.25, pause, normal beat at 2.45, 3.3
      beatTimes = [0.55, 1.25, 2.45, 3.3];
      break;
    case 'st_elevation':
      isStElev = true;
      beatTimes = [0.65, 1.55, 2.45, 3.35];
      break;
    case 'tall_t':
      isTallT = true;
      beatTimes = [0.65, 1.55, 2.45, 3.35];
      break;
    case 'nsr':
    default:
      beatTimes = [0.65, 1.55, 2.45, 3.35];
      break;
  }

  // Gaussian helper
  const addGaussian = (t0, amp, width) => {
    const halfWin = width * 4;
    const startIdx = Math.max(0, Math.floor((t0 - halfWin) * fs));
    const endIdx = Math.min(totalSamples - 1, Math.ceil((t0 + halfWin) * fs));
    for (let i = startIdx; i <= endIdx; i++) {
      const dt = time[i] - t0;
      raw[i] += amp * Math.exp(-(dt * dt) / (2 * width * width));
    }
  };

  // Add beats
  beatTimes.forEach((tb, bIdx) => {
    const isEctopic = isPvc && bIdx === 1;

    if (isEctopic) {
      // Wide, bizarre PVC morphology
      addGaussian(tb - 0.04, -0.4, 0.035);
      addGaussian(tb + 0.02, 1.5, 0.05);
      addGaussian(tb + 0.1, -0.6, 0.04);
      addGaussian(tb + 0.32, -0.5, 0.09); // Inverted discordant T
    } else {
      // Normal or semi-normal morphology
      if (!isAfib) {
        // P wave
        addGaussian(tb - 0.16, 0.18, 0.035);
      }

      // Q wave
      addGaussian(tb - 0.035, -0.18, 0.015);
      // R peak
      addGaussian(tb, 1.3, 0.02);
      // S wave
      addGaussian(tb + 0.035, -0.32, 0.018);

      // ST segment and T wave
      if (isStElev) {
        addGaussian(tb + 0.12, 0.32, 0.05); // elevated ST takeoff
        addGaussian(tb + 0.24, 0.45, 0.07);
      } else if (isTallT) {
        addGaussian(tb + 0.23, 1.05, 0.038); // narrow peaked tall T
      } else {
        addGaussian(tb + 0.23, 0.35, 0.06); // normal rounded T
      }
    }
  });

  // Background baseline wander & noise
  if (isAfib) {
    // Add fine fibrillatory baseline noise
    for (let i = 0; i < totalSamples; i++) {
      const t = time[i];
      raw[i] +=
        0.05 * Math.sin(2 * Math.PI * 6.5 * t) +
        0.03 * Math.sin(2 * Math.PI * 8.2 * t + 1.2) +
        0.02 * (Math.random() - 0.5);
    }
  } else {
    // Subtle respiratory baseline wander (0.25 Hz)
    for (let i = 0; i < totalSamples; i++) {
      raw[i] += 0.06 * Math.sin(2 * Math.PI * 0.25 * time[i]);
    }
  }

  return { time, raw, beatTimes, duration: durationSec };
}

/**
 * Helper to construct SVG polyline path string from array
 */
function buildSvgPath(dataArray, width, height, yMin, yMax) {
  const n = dataArray.length;
  if (n === 0) return '';
  const yRange = yMax - yMin || 1;

  let path = '';
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * width;
    const normY = (dataArray[i] - yMin) / yRange;
    const y = height - normY * height;
    path += (i === 0 ? 'M ' : ' L ') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return path;
}

/**
 * Interactive ECG Lab Simulator Component.
 */
export default function ECGLab() {
  const [selectedPresetId, setSelectedPresetId] = useState('nsr');
  const [hoverX, setHoverX] = useState(null);

  const fs = 200;
  const duration = 3.8; // seconds

  const currentPreset =
    SIMULATOR_PRESETS.find((p) => p.id === selectedPresetId) || SIMULATOR_PRESETS[0];

  // Deterministic signal & 3-stage Pan-Tompkins calculation
  const pipelineData = useMemo(() => {
    const { time, raw, beatTimes } = generateSyntheticTrace(selectedPresetId, fs, duration);
    const bandpass = applyBandpass(raw, fs, 5.0, 15.0);
    const derivative = applyDerivative(bandpass, fs);
    const squared = applySquaring(derivative);
    const integrated = applyIntegration(squared, fs, 150);

    // Dynamic ranges for clean visualization scaling
    let rawMin = Infinity, rawMax = -Infinity;
    let bpMin = Infinity, bpMax = -Infinity;
    let intMin = 0, intMax = -Infinity;

    for (let i = 0; i < raw.length; i++) {
      if (raw[i] < rawMin) rawMin = raw[i];
      if (raw[i] > rawMax) rawMax = raw[i];
      if (bandpass[i] < bpMin) bpMin = bandpass[i];
      if (bandpass[i] > bpMax) bpMax = bandpass[i];
      if (integrated[i] > intMax) intMax = integrated[i];
    }

    // Add padding to ranges
    rawMin -= 0.15;
    rawMax += 0.2;
    bpMin -= 0.15;
    bpMax += 0.15;
    intMax = intMax * 1.15 || 1.0;

    // Simulated threshold level at 35% of max peak
    const thresholdLevel = intMax * 0.35;

    return {
      time,
      raw,
      bandpass,
      integrated,
      beatTimes,
      rawMin,
      rawMax,
      bpMin,
      bpMax,
      intMin,
      intMax,
      thresholdLevel,
    };
  }, [selectedPresetId]);

  const svgWidth = 850;
  const traceHeight = 110;

  const rawPath = useMemo(
    () => buildSvgPath(pipelineData.raw, svgWidth, traceHeight, pipelineData.rawMin, pipelineData.rawMax),
    [pipelineData, svgWidth, traceHeight]
  );

  const bpPath = useMemo(
    () => buildSvgPath(pipelineData.bandpass, svgWidth, traceHeight, pipelineData.bpMin, pipelineData.bpMax),
    [pipelineData, svgWidth, traceHeight]
  );

  const intPath = useMemo(
    () => buildSvgPath(pipelineData.integrated, svgWidth, traceHeight, pipelineData.intMin, pipelineData.intMax),
    [pipelineData, svgWidth, traceHeight]
  );

  const thresholdY =
    traceHeight - ((pipelineData.thresholdLevel - pipelineData.intMin) / (pipelineData.intMax - pipelineData.intMin)) * traceHeight;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clampedX = Math.max(0, Math.min(rect.width, x));
    setHoverX((clampedX / rect.width) * svgWidth);
  };

  const handleMouseLeave = () => {
    setHoverX(null);
  };

  const hoverTimeSec = hoverX !== null ? ((hoverX / svgWidth) * duration).toFixed(2) : null;

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
              color: '#10b981',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.2rem',
            }}
          >
            <Sliders size={13} />
            Interactive Teaching Simulator
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Interactive ECG Lab: 3 Synchronized Traces
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
            Select a rhythm to compare how morphology deviations propagate through the Pan-Tompkins detection stages.
          </p>
        </div>

        {/* Educational Approximation Tag */}
        <span
          style={{
            fontSize: '0.72rem',
            color: '#64748b',
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid #1e293b',
            padding: '0.25rem 0.55rem',
            borderRadius: '4px',
          }}
        >
          * Educational Approximation
        </span>
      </div>

      {/* Preset Selector Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
        {SIMULATOR_PRESETS.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSelectedPresetId(preset.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: isSelected ? '1.5px solid #10b981' : '1px solid #1e293b',
                background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(11, 17, 32, 0.6)',
                color: isSelected ? '#34d399' : '#94a3b8',
                fontSize: '0.8rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: isSelected ? '#10b981' : '#475569',
                }}
              />
              {preset.name}
            </button>
          );
        })}
      </div>

      {/* 3 Synchronized Traces Container */}
      <div
        style={{
          background: '#090e1a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '0.85rem',
          position: 'relative',
          cursor: 'crosshair',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Time Readout on Hover */}
        {hoverTimeSec !== null && (
          <div
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.85rem',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              background: 'rgba(30, 41, 59, 0.9)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              border: '1px solid #334155',
              color: '#38bdf8',
              zIndex: 10,
            }}
          >
            t = {hoverTimeSec} s
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${traceHeight * 3 + 40}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          role="img"
          aria-label="Synchronized Pan-Tompkins Signal Traces"
        >
          {/* Background Highlight zones over QRS for each beat */}
          {pipelineData.beatTimes.map((tb, idx) => {
            const xCenter = (tb / duration) * svgWidth;
            const xStart = Math.max(0, xCenter - 22);
            return (
              <g key={idx}>
                <rect
                  x={xStart}
                  y="0"
                  width="44"
                  height={traceHeight * 3 + 10}
                  fill="rgba(56, 189, 248, 0.06)"
                  stroke="rgba(56, 189, 248, 0.2)"
                  strokeDasharray="2 2"
                  strokeWidth="0.8"
                />
                <text
                  x={xCenter}
                  y="12"
                  textAnchor="middle"
                  fill="rgba(56, 189, 248, 0.7)"
                  fontSize="8"
                  fontWeight="bold"
                >
                  QRS
                </text>
              </g>
            );
          })}

          {/* ── Trace 1: Original ECG ── */}
          <g transform="translate(0, 16)">
            {/* Title & Baseline */}
            <text x="8" y="14" fill="#3b82f6" fontSize="10" fontWeight="700">
              1. Original Simulated ECG
            </text>
            <line x1="0" y1={traceHeight * 0.7} x2={svgWidth} y2={traceHeight * 0.7} stroke="rgba(51, 65, 85, 0.3)" strokeDasharray="3 3" />
            <path d={rawPath} fill="none" stroke="#3b82f6" strokeWidth="1.75" />
          </g>

          {/* Separator */}
          <line x1="0" y1={traceHeight + 20} x2={svgWidth} y2={traceHeight + 20} stroke="#1e293b" strokeWidth="1" />

          {/* ── Trace 2: Bandpass Filtered Signal ── */}
          <g transform={`translate(0, ${traceHeight + 24})`}>
            <text x="8" y="14" fill="#06b6d4" fontSize="10" fontWeight="700">
              2. Bandpass Filtered Signal (5–15 Hz)
            </text>
            <line x1="0" y1={traceHeight * 0.5} x2={svgWidth} y2={traceHeight * 0.5} stroke="rgba(51, 65, 85, 0.3)" strokeDasharray="3 3" />
            <path d={bpPath} fill="none" stroke="#06b6d4" strokeWidth="1.75" />
          </g>

          {/* Separator */}
          <line x1="0" y1={traceHeight * 2 + 28} x2={svgWidth} y2={traceHeight * 2 + 28} stroke="#1e293b" strokeWidth="1" />

          {/* ── Trace 3: Moving-Window Integrated Signal ── */}
          <g transform={`translate(0, ${traceHeight * 2 + 32})`}>
            <text x="8" y="14" fill="#10b981" fontSize="10" fontWeight="700">
              3. Moving-Window Integrated Signal
            </text>
            {/* Threshold Line */}
            <line
              x1="0"
              y1={thresholdY}
              x2={svgWidth}
              y2={thresholdY}
              stroke="#fbbf24"
              strokeWidth="1.25"
              strokeDasharray="4 3"
            />
            <text x={svgWidth - 90} y={thresholdY - 4} fill="#fbbf24" fontSize="8" fontWeight="bold">
              Adaptive Threshold
            </text>
            <path d={intPath} fill="none" stroke="#10b981" strokeWidth="2" />
          </g>

          {/* Synchronized Hover Cursor */}
          {hoverX !== null && (
            <line
              x1={hoverX}
              y1="0"
              x2={hoverX}
              y2={traceHeight * 3 + 32}
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
          )}
        </svg>
      </div>

      {/* Educational Analysis Answering the Core Questions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          background: 'rgba(11, 17, 32, 0.85)',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '1.15rem',
        }}
      >
        {/* Q1: What changes in the ECG? */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700 }}>
            <Info size={14} />
            What changes in the ECG?
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45, margin: 0 }}>
            {currentPreset.ecgChanges}
          </p>
        </div>

        {/* Q2: How does Pan-Tompkins respond? */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
            <Zap size={14} />
            How does the Pan-Tompkins pipeline respond?
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45, margin: 0 }}>
            {currentPreset.pipelineResponse}
          </p>
        </div>

        {/* Q3: Algorithm Safeguards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>
            <CheckCircle2 size={14} />
            Algorithm Safeguards
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45, margin: 0 }}>
            {currentPreset.safeguards}
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.55rem 0.75rem',
          borderRadius: '6px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          color: '#fbbf24',
          fontSize: '0.75rem',
        }}
      >
        <AlertTriangle size={13} style={{ flexShrink: 0 }} />
        <span>{DISCLAIMER_TEXT}</span>
      </div>
    </section>
  );
}
