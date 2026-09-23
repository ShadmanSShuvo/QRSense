import React from 'react';
import { WAVEFORM_COMPONENTS } from './ecgData';

/**
 * High-definition interactive SVG ECG waveform.
 * Renders an idealized P-Q-R-S-T cardiac cycle on an ECG grid with interactive
 * hotspots, direct labels, and interval brackets.
 */
export default function ECGWaveform({ selectedId, onSelect, hoveredId, onHover }) {
  const activeId = hoveredId || selectedId;

  // Key coordinate milestones in the 900x320 SVG space
  // Y baseline is at 200. Positive voltage goes UP (lower Y), negative voltage goes DOWN (higher Y).
  // Y = 200 is 0.0 mV
  // Y = 60 is +1.4 mV (R peak)
  // Y = 230 is -0.3 mV (S wave)
  const BASELINE_Y = 200;

  // Waveform Path Definitions (smooth SVG path)
  // [0..140]: Flat baseline
  // [140..240]: P wave (peak at 190, y=165, amp=+35px ~ 0.25mV)
  // [240..310]: PR segment (baseline y=200)
  // [310..340]: Q wave (dip at 340, y=225, amp=-25px)
  // [340..390]: R wave (peak at 390, y=65, amp=+135px ~ 1.2mV)
  // [390..440]: S wave (dip at 440, y=245, amp=-45px)
  // [440..530]: ST segment (baseline y=200)
  // [530..690]: T wave (asymmetric peak at 620, y=145, amp=+55px ~ 0.4mV)
  // [690..900]: Isoelectric return (baseline y=200)

  // Segment stroke colors based on active selection
  const getSegmentColor = (id, defaultColor = '#94a3b8') => {
    if (activeId === id) return WAVEFORM_COMPONENTS[id]?.color || '#38bdf8';
    return defaultColor;
  };

  const getSegmentWidth = (id, defaultWidth = 3) => {
    return activeId === id ? 5 : defaultWidth;
  };

  const isIntervalActive = (id) => activeId === id;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <svg
        viewBox="0 0 900 320"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          background: '#090e1a',
          borderRadius: '12px',
          border: '1px solid #1e293b',
          overflow: 'hidden',
        }}
        role="img"
        aria-label="Interactive Idealized ECG Waveform"
      >
        <defs>
          {/* Subtle ECG grid pattern: 20px minor grid, 100px major grid */}
          <pattern id="ecg-minor-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(51, 65, 85, 0.2)" strokeWidth="0.75" />
          </pattern>
          <pattern id="ecg-major-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#ecg-minor-grid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1.25" />
          </pattern>

          {/* Glow filter for active highlighted segment */}
          <filter id="ecg-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ECG Grid Paper Background */}
        <rect width="900" height="320" fill="url(#ecg-major-grid)" />

        {/* Isoelectric Baseline Reference Line (0 mV) */}
        <line
          x1="0"
          y1={BASELINE_Y}
          x2="900"
          y2={BASELINE_Y}
          stroke="rgba(148, 163, 184, 0.22)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="12"
          y={BASELINE_Y - 6}
          fill="rgba(148, 163, 184, 0.45)"
          fontSize="10"
          fontFamily="monospace"
        >
          0.0 mV Isoelectric Baseline
        </text>

        {/* ── Active Interval Shaded Backgrounds ── */}
        {isIntervalActive('pr_interval') && (
          <rect
            x="140"
            y="40"
            width="170"
            height="240"
            fill="rgba(129, 140, 248, 0.12)"
            stroke="rgba(129, 140, 248, 0.4)"
            strokeWidth="1"
            strokeDasharray="3 3"
            rx="6"
          />
        )}
        {isIntervalActive('qrs_complex') && (
          <rect
            x="310"
            y="40"
            width="130"
            height="240"
            fill="rgba(236, 72, 153, 0.12)"
            stroke="rgba(236, 72, 153, 0.4)"
            strokeWidth="1"
            strokeDasharray="3 3"
            rx="6"
          />
        )}
        {isIntervalActive('st_segment') && (
          <rect
            x="440"
            y="40"
            width="90"
            height="240"
            fill="rgba(168, 85, 247, 0.12)"
            stroke="rgba(168, 85, 247, 0.4)"
            strokeWidth="1"
            strokeDasharray="3 3"
            rx="6"
          />
        )}
        {isIntervalActive('qt_interval') && (
          <rect
            x="310"
            y="40"
            width="380"
            height="240"
            fill="rgba(6, 182, 212, 0.1)"
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="1"
            strokeDasharray="3 3"
            rx="6"
          />
        )}

        {/* ── Waveform Segments (Layered for visual polish) ── */}

        {/* 1. Pre-P Baseline */}
        <line x1="0" y1={BASELINE_Y} x2="140" y2={BASELINE_Y} stroke="#475569" strokeWidth="2.5" />

        {/* 2. P Wave: 140 to 240 */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('p_wave')}
          onMouseEnter={() => onHover('p_wave')}
          onMouseLeave={() => onHover(null)}
        >
          {/* Broad invisible hit area for easy hover/touch */}
          <path
            d="M 140 200 C 160 200, 170 165, 190 165 C 210 165, 220 200, 240 200"
            fill="none"
            stroke="transparent"
            strokeWidth="24"
          />
          <path
            d="M 140 200 C 160 200, 170 165, 190 165 C 210 165, 220 200, 240 200"
            fill="none"
            stroke={getSegmentColor('p_wave', '#94a3b8')}
            strokeWidth={getSegmentWidth('p_wave')}
            filter={activeId === 'p_wave' ? 'url(#ecg-glow)' : undefined}
          />
        </g>

        {/* 3. PR Segment (Isoelectric baseline between P and Q): 240 to 310 */}
        <line
          x1="240"
          y1={BASELINE_Y}
          x2="310"
          y2={BASELINE_Y}
          stroke={activeId === 'pr_interval' ? '#818cf8' : '#64748b'}
          strokeWidth={activeId === 'pr_interval' ? 4 : 2.5}
        />

        {/* 4. Q Wave: 310 to 340 (dip to 225) */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('q_wave')}
          onMouseEnter={() => onHover('q_wave')}
          onMouseLeave={() => onHover(null)}
        >
          <path d="M 310 200 L 340 225" fill="none" stroke="transparent" strokeWidth="24" />
          <path
            d="M 310 200 L 340 225"
            fill="none"
            stroke={getSegmentColor('q_wave', activeId === 'qrs_complex' ? '#ec4899' : '#94a3b8')}
            strokeWidth={getSegmentWidth('q_wave')}
            filter={activeId === 'q_wave' ? 'url(#ecg-glow)' : undefined}
          />
        </g>

        {/* 5. R Wave Upstroke & Downstroke: 340 -> 390 (peak 65) -> 440 (S dip 245) */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('r_wave')}
          onMouseEnter={() => onHover('r_wave')}
          onMouseLeave={() => onHover(null)}
        >
          <path d="M 340 225 L 390 65 L 415 200" fill="none" stroke="transparent" strokeWidth="24" />
          <path
            d="M 340 225 L 390 65 L 415 200"
            fill="none"
            stroke={getSegmentColor('r_wave', activeId === 'qrs_complex' ? '#ec4899' : '#94a3b8')}
            strokeWidth={getSegmentWidth('r_wave')}
            filter={activeId === 'r_wave' ? 'url(#ecg-glow)' : undefined}
          />
        </g>

        {/* 6. S Wave: 415 to 440 (dip to 245) and return to 455 (y=200) */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('s_wave')}
          onMouseEnter={() => onHover('s_wave')}
          onMouseLeave={() => onHover(null)}
        >
          <path d="M 415 200 L 440 245 L 455 200" fill="none" stroke="transparent" strokeWidth="24" />
          <path
            d="M 415 200 L 440 245 L 455 200"
            fill="none"
            stroke={getSegmentColor('s_wave', activeId === 'qrs_complex' ? '#ec4899' : '#94a3b8')}
            strokeWidth={getSegmentWidth('s_wave')}
            filter={activeId === 's_wave' ? 'url(#ecg-glow)' : undefined}
          />
        </g>

        {/* 7. ST Segment (J-point 455 to 530) */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('st_segment')}
          onMouseEnter={() => onHover('st_segment')}
          onMouseLeave={() => onHover(null)}
        >
          <line x1="455" y1={BASELINE_Y} x2="530" y2={BASELINE_Y} stroke="transparent" strokeWidth="24" />
          <line
            x1="455"
            y1={BASELINE_Y}
            x2="530"
            y2={BASELINE_Y}
            stroke={getSegmentColor('st_segment', '#64748b')}
            strokeWidth={getSegmentWidth('st_segment')}
            filter={activeId === 'st_segment' ? 'url(#ecg-glow)' : undefined}
          />
        </g>

        {/* 8. T Wave: 530 to 690 (asymmetric peak at 620, y=145) */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('t_wave')}
          onMouseEnter={() => onHover('t_wave')}
          onMouseLeave={() => onHover(null)}
        >
          <path
            d="M 530 200 C 560 200, 590 145, 620 145 C 650 145, 670 200, 690 200"
            fill="none"
            stroke="transparent"
            strokeWidth="24"
          />
          <path
            d="M 530 200 C 560 200, 590 145, 620 145 C 650 145, 670 200, 690 200"
            fill="none"
            stroke={getSegmentColor('t_wave', '#94a3b8')}
            strokeWidth={getSegmentWidth('t_wave')}
            filter={activeId === 't_wave' ? 'url(#ecg-glow)' : undefined}
          />
        </g>

        {/* 9. Post-T Baseline */}
        <line x1="690" y1={BASELINE_Y} x2="900" y2={BASELINE_Y} stroke="#475569" strokeWidth="2.5" />

        {/* ── Direct Waveform Anchor Badges & Labels ── */}

        {/* P Label */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('p_wave')}
          onMouseEnter={() => onHover('p_wave')}
          onMouseLeave={() => onHover(null)}
        >
          <circle
            cx="190"
            cy="165"
            r={activeId === 'p_wave' ? 14 : 11}
            fill={activeId === 'p_wave' ? '#38bdf8' : '#1e293b'}
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <text
            x="190"
            y="170"
            textAnchor="middle"
            fill={activeId === 'p_wave' ? '#0f172a' : '#38bdf8'}
            fontSize="12"
            fontWeight="700"
          >
            P
          </text>
        </g>

        {/* Q Label */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('q_wave')}
          onMouseEnter={() => onHover('q_wave')}
          onMouseLeave={() => onHover(null)}
        >
          <circle
            cx="340"
            cy="225"
            r={activeId === 'q_wave' ? 13 : 10}
            fill={activeId === 'q_wave' ? '#fbbf24' : '#1e293b'}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <text
            x="340"
            y="229"
            textAnchor="middle"
            fill={activeId === 'q_wave' ? '#0f172a' : '#fbbf24'}
            fontSize="11"
            fontWeight="700"
          >
            Q
          </text>
        </g>

        {/* R Label */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('r_wave')}
          onMouseEnter={() => onHover('r_wave')}
          onMouseLeave={() => onHover(null)}
        >
          <circle
            cx="390"
            cy="65"
            r={activeId === 'r_wave' ? 16 : 13}
            fill={activeId === 'r_wave' ? '#ef4444' : '#1e293b'}
            stroke="#ef4444"
            strokeWidth="2.5"
          />
          <text
            x="390"
            y="70"
            textAnchor="middle"
            fill={activeId === 'r_wave' ? '#ffffff' : '#ef4444'}
            fontSize="13"
            fontWeight="800"
          >
            R
          </text>
        </g>

        {/* S Label */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('s_wave')}
          onMouseEnter={() => onHover('s_wave')}
          onMouseLeave={() => onHover(null)}
        >
          <circle
            cx="440"
            cy="245"
            r={activeId === 's_wave' ? 13 : 10}
            fill={activeId === 's_wave' ? '#f97316' : '#1e293b'}
            stroke="#f97316"
            strokeWidth="2"
          />
          <text
            x="440"
            y="249"
            textAnchor="middle"
            fill={activeId === 's_wave' ? '#0f172a' : '#f97316'}
            fontSize="11"
            fontWeight="700"
          >
            S
          </text>
        </g>

        {/* T Label */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('t_wave')}
          onMouseEnter={() => onHover('t_wave')}
          onMouseLeave={() => onHover(null)}
        >
          <circle
            cx="620"
            cy="145"
            r={activeId === 't_wave' ? 14 : 11}
            fill={activeId === 't_wave' ? '#10b981' : '#1e293b'}
            stroke="#10b981"
            strokeWidth="2"
          />
          <text
            x="620"
            y="150"
            textAnchor="middle"
            fill={activeId === 't_wave' ? '#0f172a' : '#10b981'}
            fontSize="12"
            fontWeight="700"
          >
            T
          </text>
        </g>

        {/* ── Interval Brackets along Bottom (Y = 275 - 305) ── */}

        {/* PR Interval Bracket */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('pr_interval')}
          onMouseEnter={() => onHover('pr_interval')}
          onMouseLeave={() => onHover(null)}
        >
          <path
            d="M 140 270 L 140 278 L 310 278 L 310 270"
            fill="none"
            stroke={activeId === 'pr_interval' ? '#818cf8' : '#475569'}
            strokeWidth={activeId === 'pr_interval' ? 2.5 : 1.5}
          />
          <text
            x="225"
            y="292"
            textAnchor="middle"
            fill={activeId === 'pr_interval' ? '#818cf8' : '#94a3b8'}
            fontSize="11"
            fontWeight={activeId === 'pr_interval' ? '700' : '500'}
          >
            PR Interval
          </text>
        </g>

        {/* QRS Duration Bracket */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('qrs_complex')}
          onMouseEnter={() => onHover('qrs_complex')}
          onMouseLeave={() => onHover(null)}
        >
          <path
            d="M 310 270 L 310 278 L 440 278 L 440 270"
            fill="none"
            stroke={activeId === 'qrs_complex' ? '#ec4899' : '#475569'}
            strokeWidth={activeId === 'qrs_complex' ? 2.5 : 1.5}
          />
          <text
            x="375"
            y="292"
            textAnchor="middle"
            fill={activeId === 'qrs_complex' ? '#ec4899' : '#94a3b8'}
            fontSize="11"
            fontWeight={activeId === 'qrs_complex' ? '700' : '500'}
          >
            QRS
          </text>
        </g>

        {/* ST Segment Bracket */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('st_segment')}
          onMouseEnter={() => onHover('st_segment')}
          onMouseLeave={() => onHover(null)}
        >
          <path
            d="M 440 270 L 440 278 L 530 278 L 530 270"
            fill="none"
            stroke={activeId === 'st_segment' ? '#a855f7' : '#475569'}
            strokeWidth={activeId === 'st_segment' ? 2.5 : 1.5}
          />
          <text
            x="485"
            y="292"
            textAnchor="middle"
            fill={activeId === 'st_segment' ? '#a855f7' : '#94a3b8'}
            fontSize="11"
            fontWeight={activeId === 'st_segment' ? '700' : '500'}
          >
            ST
          </text>
        </g>

        {/* QT Interval Bracket (Higher or Lower Tier) */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect('qt_interval')}
          onMouseEnter={() => onHover('qt_interval')}
          onMouseLeave={() => onHover(null)}
        >
          <path
            d="M 310 305 L 310 312 L 690 312 L 690 305"
            fill="none"
            stroke={activeId === 'qt_interval' ? '#06b6d4' : '#475569'}
            strokeWidth={activeId === 'qt_interval' ? 2.5 : 1.5}
          />
          <text
            x="500"
            y="308"
            textAnchor="middle"
            fill={activeId === 'qt_interval' ? '#06b6d4' : '#94a3b8'}
            fontSize="11"
            fontWeight={activeId === 'qt_interval' ? '700' : '500'}
          >
            QT Interval
          </text>
        </g>
      </svg>
    </div>
  );
}
