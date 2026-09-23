import React from 'react';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';

/**
 * PlaybackControls
 *
 * Streamlined horizontal transport bar located directly underneath the ECG plot.
 * Combines playback buttons, beat navigation, speed selection, timeline scrubber,
 * and time/sample readout in an intuitive oscilloscope-style console.
 *
 * @param {Object} props
 * @param {Object} props.state - Current playback state { currentTime, isPlaying, playbackRate, beatIndex, currentSampleIndex }
 * @param {Object} props.controls - Transport controls { play, pause, stop, seek, setPlaybackRate, stepSample, stepBeat }
 * @param {number} props.duration - Total signal duration in seconds
 * @param {number} props.totalBeats - Total number of detected beats
 */
export default function PlaybackControls({
  state = {},
  controls = {},
  duration = 10,
  totalBeats = 0,
}) {
  const {
    currentTime = 0,
    isPlaying = false,
    playbackRate = 1,
    beatIndex,
    currentSampleIndex,
  } = state;

  const {
    play = () => { },
    pause = () => { },
    stop = () => { },
    seek = () => { },
    setPlaybackRate = () => { },
    stepSample = () => { },
    stepBeat = () => { },
  } = controls;

  // Available speed options
  const SPEED_OPTIONS = [0.1, 0.25, 0.5, 1];

  const handleTogglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleSliderChange = (e) => {
    const nextTime = parseFloat(e.target.value);
    seek(nextTime);
    pause();
  };

  const safeCurrentTime = Number.isFinite(currentTime) ? currentTime : 0;
  const safeDuration = Number.isFinite(duration) ? duration : 10;
  const currentBeatText = beatIndex != null && Number.isFinite(beatIndex) ? beatIndex + 1 : '--';
  const totalBeatText = totalBeats || '--';

  const baseBtnStyle = {
    background: '#0f172a',
    border: '1px solid #334155',
    color: '#f8fafc',
    borderRadius: '6px',
    padding: '5px 8px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontSize: '0.78rem',
    fontWeight: 500,
    transition: 'all 0.15s ease',
    userSelect: 'none',
    boxSizing: 'border-box',
    lineHeight: 1,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45rem',
        background: 'rgba(15, 23, 42, 0.88)',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '0.55rem 0.85rem',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Row 1: Transport Actions, Beat Navigation, Speed Buttons, Time Readout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: Play/Pause, Stop & Stepping buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {/* Play/Pause */}
          <button
            type="button"
            onClick={handleTogglePlay}
            style={{
              ...baseBtnStyle,
              background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.25)',
              borderColor: isPlaying ? '#ef4444' : '#10b981',
              color: isPlaying ? '#fca5a5' : '#34d399',
              fontWeight: 700,
              padding: '6px 12px',
            }}
            title={isPlaying ? 'Pause playback' : 'Start real-time playback'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <>
                <Pause size={14} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Stop */}
          <button
            type="button"
            onClick={stop}
            style={{
              ...baseBtnStyle,
              background: 'rgba(30, 41, 59, 0.7)',
              borderColor: '#475569',
              color: '#cbd5e1',
              padding: '6px 10px',
            }}
            title="Stop and reset to beginning"
            aria-label="Stop"
          >
            <Square size={13} fill="currentColor" />
            <span>Stop</span>
          </button>

          <span style={{ color: '#334155', margin: '0 0.15rem' }}>|</span>

          {/* |◀ Prev Beat */}
          <button
            type="button"
            onClick={() => stepBeat(-1)}
            style={{ ...baseBtnStyle, padding: '6px 8px' }}
            title="Previous Beat (Jump to previous R-peak)"
            aria-label="Previous beat"
          >
            <SkipBack size={13} />
            <span style={{ fontSize: '0.74rem' }}>Prev Beat</span>
          </button>

          {/* ◀ Step Sample */}
          <button
            type="button"
            onClick={() => stepSample(-1)}
            style={{ ...baseBtnStyle, padding: '6px 7px' }}
            title="Step back 1 sample"
            aria-label="Step back sample"
          >
            <ChevronLeft size={14} />
          </button>

          {/* Step Sample ▶ */}
          <button
            type="button"
            onClick={() => stepSample(1)}
            style={{ ...baseBtnStyle, padding: '6px 7px' }}
            title="Step forward 1 sample"
            aria-label="Step forward sample"
          >
            <ChevronRight size={14} />
          </button>

          {/* Next Beat ▶| */}
          <button
            type="button"
            onClick={() => stepBeat(1)}
            style={{ ...baseBtnStyle, padding: '6px 8px' }}
            title="Next Beat (Jump to next R-peak)"
            aria-label="Next beat"
          >
            <span style={{ fontSize: '0.74rem' }}>Next Beat</span>
            <SkipForward size={13} />
          </button>

          {/* Beat Counter Badge */}
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 600,
              color: '#94a3b8',
              marginLeft: '0.25rem',
              background: 'rgba(30, 41, 59, 0.6)',
              padding: '3px 8px',
              borderRadius: '5px',
              border: '1px solid rgba(51, 65, 85, 0.6)',
            }}
          >
            Beat <strong style={{ color: '#38bdf8' }}>{currentBeatText}</strong> / {totalBeatText}
          </span>
        </div>

        {/* Right: Speed options & Clock readout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {/* Speed Buttons */}
          <div style={{ display: 'inline-flex', background: 'rgba(15, 23, 42, 0.8)', padding: '2px', borderRadius: '6px', border: '1px solid #334155' }}>
            {SPEED_OPTIONS.map((rate) => {
              const isActive = Math.abs(playbackRate - rate) < 0.001;
              return (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setPlaybackRate(rate)}
                  style={{
                    background: isActive ? '#38bdf8' : 'transparent',
                    border: 'none',
                    color: isActive ? '#0f172a' : '#94a3b8',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.72rem',
                    padding: '3px 7px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                  title={`Set playback speed to ${rate}×`}
                >
                  {rate}×
                </button>
              );
            })}
          </div>

          <span style={{ color: '#334155' }}>|</span>

          {/* Time & Sample readout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.76rem',
              color: '#94a3b8',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <Clock size={13} color="#38bdf8" />
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>
              {safeCurrentTime.toFixed(3)}s / {safeDuration.toFixed(1)}s
            </span>
            {currentSampleIndex != null && Number.isFinite(currentSampleIndex) && (
              <span style={{ color: '#64748b' }}>
                (Spl {Math.round(currentSampleIndex)})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Timeline Scrubber Slider */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <input
          type="range"
          min={0}
          max={duration || 10}
          step={0.001}
          value={Number.isFinite(currentTime) ? currentTime : 0}
          onChange={handleSliderChange}
          style={{
            width: '100%',
            accentColor: '#38bdf8',
            cursor: 'pointer',
            height: '5px',
            borderRadius: '3px',
            background: '#334155',
            outline: 'none',
          }}
          aria-label="Signal timeline scrubber"
        />
      </div>
    </div>
  );
}
