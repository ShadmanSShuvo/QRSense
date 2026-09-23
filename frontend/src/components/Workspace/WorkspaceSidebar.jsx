import React, { useState, useRef, useEffect } from 'react';
import {
  Sliders,
  Layers,
  ZoomIn,
  RotateCcw,
  Activity,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Check,
  Eye,
  Settings,
} from 'lucide-react';

/**
 * WorkspaceSidebar
 *
 * Dedicated Control Sidebar for the Interactive Workspace.
 * Supports 3 visual states:
 *   - 'standard': Full ~230px expanded control panel
 *   - 'clean': Completely hidden (no column footprint)
 *   - 'ecg-only': Collapsed 54px icon rail with accessible flyout popovers
 */
export default function WorkspaceSidebar({
  workspaceView = 'standard',
  setWorkspaceView = () => {},
  records = [],
  selectedRecord = '100',
  setSelectedRecord = () => {},
  lowcut = 5.0,
  setLowcut = () => {},
  highcut = 15.0,
  setHighcut = () => {},
  windowSize = 150,
  setWindowSize = () => {},
  processSignal = () => {},
  loading = false,
  error = null,
  showRefractory = true,
  setShowRefractory = () => {},
  showSearchback = true,
  setShowSearchback = () => {},
  showRejectedT = true,
  setShowRejectedT = () => {},
  showThresholds = true,
  setShowThresholds = () => {},
  showDelineation = true,
  setShowDelineation = () => {},
  activeStage = 'original',
  resetZoom = () => {},
  focusBeat = () => {},
  selectedBeatIndex = 0,
  cardStyle = {},
}) {
  const [activePopover, setActivePopover] = useState(null); // 'settings' | 'overlays' | 'zoom' | null
  const sidebarRef = useRef(null);

  // Close flyout popovers when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setActivePopover(null);
      }
    }
    if (activePopover) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activePopover]);

  // If in 'clean' view, sidebar is completely hidden
  if (workspaceView === 'clean') {
    return null;
  }

  // ─────────────────────────────────────────────────────────────
  // 1. COLLAPSED ICON RAIL (FOR 'ecg-only' VIEW)
  // ─────────────────────────────────────────────────────────────
  if (workspaceView === 'ecg-only') {
    return (
      <aside
        ref={sidebarRef}
        className="card sidebar-rail"
        style={{
          ...cardStyle,
          width: '54px',
          minWidth: '54px',
          maxWidth: '54px',
          padding: '0.75rem 0.35rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.85rem',
          position: 'sticky',
          top: '1.15rem',
          alignSelf: 'start',
          zIndex: 40,
          boxSizing: 'border-box',
        }}
      >
        {/* Toggle back to Standard View */}
        <button
          type="button"
          onClick={() => setWorkspaceView('standard')}
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid #334155',
            color: '#38bdf8',
            borderRadius: '8px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Expand to Standard View (Full Control Panel)"
          aria-label="Expand to Standard View"
        >
          <ChevronRight size={18} />
        </button>

        <div style={{ width: '28px', height: '1px', background: 'rgba(51, 65, 85, 0.6)' }} />

        {/* ⚙ Signal Parameters Icon */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setActivePopover(activePopover === 'settings' ? null : 'settings')}
            style={{
              background: activePopover === 'settings' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
              border: activePopover === 'settings' ? '1px solid #38bdf8' : '1px solid #334155',
              color: activePopover === 'settings' ? '#38bdf8' : '#cbd5e1',
              borderRadius: '8px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Signal Controls (MIT-BIH Record & Filter Parameters)"
            aria-label="Signal Controls"
          >
            <Settings size={18} />
          </button>

          {/* Floating Flyout Popover for Parameters */}
          {activePopover === 'settings' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '48px',
                width: '240px',
                background: 'rgba(15, 23, 42, 0.96)',
                border: '1px solid #38bdf8',
                borderRadius: '12px',
                padding: '0.85rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                zIndex: 50,
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
                Signal Controls
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem' }}>MIT-BIH Record</label>
                <select
                  className="form-control"
                  value={selectedRecord}
                  onChange={(e) => setSelectedRecord(e.target.value)}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                >
                  {records.map((rec) => (
                    <option key={rec} value={rec}>
                      Record {rec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem' }}>
                  Lowcut <span>{lowcut.toFixed(1)} Hz</span>
                </label>
                <input
                  type="range"
                  className="range-slider"
                  min="1"
                  max="10"
                  step="0.5"
                  value={lowcut}
                  onChange={(e) => setLowcut(Number(e.target.value))}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem' }}>
                  Highcut <span>{highcut.toFixed(1)} Hz</span>
                </label>
                <input
                  type="range"
                  className="range-slider"
                  min="10"
                  max="30"
                  step="0.5"
                  value={highcut}
                  onChange={(e) => setHighcut(Number(e.target.value))}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.74rem' }}>
                  Integration <span>{windowSize} ms</span>
                </label>
                <input
                  type="range"
                  className="range-slider"
                  min="80"
                  max="200"
                  step="10"
                  value={windowSize}
                  onChange={(e) => setWindowSize(Number(e.target.value))}
                />
              </div>

              <button
                className="btn"
                onClick={() => {
                  processSignal();
                  setActivePopover(null);
                }}
                disabled={loading}
                style={{ marginTop: '0.3rem', padding: '0.45rem', fontSize: '0.78rem' }}
              >
                {loading ? 'Processing...' : 'Apply & Process'}
              </button>
            </div>
          )}
        </div>

        {/* ◉ Detection Overlays Icon */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setActivePopover(activePopover === 'overlays' ? null : 'overlays')}
            style={{
              background: activePopover === 'overlays' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
              border: activePopover === 'overlays' ? '1px solid #38bdf8' : '1px solid #334155',
              color: activePopover === 'overlays' ? '#38bdf8' : '#cbd5e1',
              borderRadius: '8px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Detection Overlays (Refractory, Search-Back, Thresholds, Morphology)"
            aria-label="Detection Overlays"
          >
            <Layers size={18} />
          </button>

          {/* Floating Flyout Popover for Overlays */}
          {activePopover === 'overlays' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '48px',
                width: '210px',
                background: 'rgba(15, 23, 42, 0.96)',
                border: '1px solid #38bdf8',
                borderRadius: '12px',
                padding: '0.75rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                zIndex: 50,
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
                Detection Overlays
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.76rem', color: '#cbd5e1', cursor: 'pointer' }}>
                <input type="checkbox" checked={showRefractory} onChange={(e) => setShowRefractory(e.target.checked)} />
                Refractory (200 ms)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.76rem', color: '#cbd5e1', cursor: 'pointer' }}>
                <input type="checkbox" checked={showSearchback} onChange={(e) => setShowSearchback(e.target.checked)} />
                Search-Back Recovery
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.76rem', color: '#cbd5e1', cursor: 'pointer' }}>
                <input type="checkbox" checked={showRejectedT} onChange={(e) => setShowRejectedT(e.target.checked)} />
                Rejected T-Waves
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.76rem', color: '#cbd5e1', cursor: 'pointer' }}>
                <input type="checkbox" checked={showThresholds} onChange={(e) => setShowThresholds(e.target.checked)} />
                Adaptive Thresholds
              </label>

              {activeStage === 'original' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.76rem', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input type="checkbox" checked={showDelineation} onChange={(e) => setShowDelineation(e.target.checked)} />
                  QRS Morphology
                </label>
              )}
            </div>
          )}
        </div>

        {/* ⌕ Zoom & Beat Presets Icon */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setActivePopover(activePopover === 'zoom' ? null : 'zoom')}
            style={{
              background: activePopover === 'zoom' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
              border: activePopover === 'zoom' ? '1px solid #38bdf8' : '1px solid #334155',
              color: activePopover === 'zoom' ? '#38bdf8' : '#cbd5e1',
              borderRadius: '8px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Zoom & View Presets (Full Signal, Focus Beat)"
            aria-label="Zoom and View Presets"
          >
            <ZoomIn size={18} />
          </button>

          {/* Floating Flyout Popover for Zoom */}
          {activePopover === 'zoom' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '48px',
                width: '180px',
                background: 'rgba(15, 23, 42, 0.96)',
                border: '1px solid #38bdf8',
                borderRadius: '12px',
                padding: '0.75rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                zIndex: 50,
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
                View &amp; Zoom
              </div>

              <button
                type="button"
                onClick={() => {
                  resetZoom();
                  setActivePopover(null);
                }}
                className="btn"
                style={{ padding: '0.4rem', fontSize: '0.75rem', background: '#334155' }}
              >
                Reset Zoom (0-10s)
              </button>

              <button
                type="button"
                onClick={() => {
                  focusBeat(selectedBeatIndex);
                  setActivePopover(null);
                }}
                className="btn"
                style={{ padding: '0.4rem', fontSize: '0.75rem', background: '#334155' }}
              >
                Focus Beat #{selectedBeatIndex + 1}
              </button>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. EXPANDED SIDEBAR (FOR 'standard' VIEW)
  // ─────────────────────────────────────────────────────────────
  return (
    <aside
      className="card workspace-sidebar"
      style={{
        ...cardStyle,
        width: '230px',
        minWidth: '220px',
        maxWidth: '240px',
        padding: '0.85rem',
        alignSelf: 'start',
        position: 'sticky',
        top: '1.15rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        boxSizing: 'border-box',
      }}
    >
      {/* Sidebar Header with Collapse Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(51, 65, 85, 0.6)',
          paddingBottom: '0.45rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Activity size={17} color="#38bdf8" />
          <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
            Controls
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setWorkspaceView('clean')}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Hide Left Sidebar (Clean View)"
          aria-label="Hide Sidebar"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* ───────────────── Signal Controls ───────────────── */}
      <div className="form-group" style={{ marginBottom: '0.45rem' }}>
        <label style={{ fontSize: '0.76rem', color: '#94a3b8' }}>MIT-BIH Record</label>
        <select
          className="form-control"
          value={selectedRecord}
          onChange={(e) => setSelectedRecord(e.target.value)}
          style={{ fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
        >
          {records.map((rec) => (
            <option key={rec} value={rec}>
              Record {rec}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group" style={{ marginBottom: '0.45rem' }}>
        <label style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
          Bandpass Lowcut <span>{lowcut.toFixed(1)} Hz</span>
        </label>
        <input
          type="range"
          className="range-slider"
          min="1"
          max="10"
          step="0.5"
          value={lowcut}
          onChange={(e) => setLowcut(Number(e.target.value))}
        />
      </div>

      <div className="form-group" style={{ marginBottom: '0.45rem' }}>
        <label style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
          Bandpass Highcut <span>{highcut.toFixed(1)} Hz</span>
        </label>
        <input
          type="range"
          className="range-slider"
          min="10"
          max="30"
          step="0.5"
          value={highcut}
          onChange={(e) => setHighcut(Number(e.target.value))}
        />
      </div>

      <div className="form-group" style={{ marginBottom: '0.45rem' }}>
        <label style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
          Integration Window <span>{windowSize} ms</span>
        </label>
        <input
          type="range"
          className="range-slider"
          min="80"
          max="200"
          step="10"
          value={windowSize}
          onChange={(e) => setWindowSize(Number(e.target.value))}
        />
      </div>

      <button
        className="btn"
        onClick={processSignal}
        disabled={loading}
        style={{ width: '100%', padding: '0.5rem', fontSize: '0.84rem' }}
      >
        {loading ? 'Processing...' : 'Apply & Process'}
      </button>

      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.76rem', lineHeight: 1.3 }}>
          Error: {error}
        </div>
      )}

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(51, 65, 85, 0.6)', margin: '0.2rem 0' }} />

      {/* ───────────────── Detection Overlays ───────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Detection Overlays
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', color: '#cbd5e1', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showRefractory}
            onChange={(e) => setShowRefractory(e.target.checked)}
            style={{ accentColor: '#ef4444' }}
          />
          <span>Refractory (200 ms)</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', color: '#cbd5e1', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showSearchback}
            onChange={(e) => setShowSearchback(e.target.checked)}
            style={{ accentColor: '#f59e0b' }}
          />
          <span>Search-Back</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', color: '#cbd5e1', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showRejectedT}
            onChange={(e) => setShowRejectedT(e.target.checked)}
            style={{ accentColor: '#c084fc' }}
          />
          <span>Rejected T-Waves</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', color: '#cbd5e1', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showThresholds}
            onChange={(e) => setShowThresholds(e.target.checked)}
            style={{ accentColor: '#10b981' }}
          />
          <span>Adaptive Thresholds</span>
        </label>

        {activeStage === 'original' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showDelineation}
              onChange={(e) => setShowDelineation(e.target.checked)}
              style={{ accentColor: '#3b82f6' }}
            />
            <span>QRS Morphology</span>
          </label>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(51, 65, 85, 0.6)', margin: '0.2rem 0' }} />

      {/* ───────────────── View & Zoom Presets ───────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          View Presets
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={resetZoom}
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid #334155',
              color: '#cbd5e1',
              borderRadius: '6px',
              padding: '0.35rem 0.4rem',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
            }}
            title="Reset Zoom to 0-10s"
          >
            <RotateCcw size={12} />
            <span>Full 10s</span>
          </button>

          <button
            type="button"
            onClick={() => focusBeat(selectedBeatIndex)}
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid #334155',
              color: '#cbd5e1',
              borderRadius: '6px',
              padding: '0.35rem 0.4rem',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
            }}
            title="Focus Current Beat"
          >
            <ZoomIn size={12} />
            <span>Focus Beat</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={() => {
              setShowRefractory(false);
              setShowSearchback(false);
              setShowRejectedT(false);
              setShowThresholds(false);
              setShowDelineation(false);
            }}
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid #334155',
              color: '#94a3b8',
              borderRadius: '6px',
              padding: '0.3rem 0.4rem',
              fontSize: '0.7rem',
              cursor: 'pointer',
            }}
          >
            Clean View
          </button>

          <button
            type="button"
            onClick={() => {
              setShowRefractory(true);
              setShowSearchback(true);
              setShowRejectedT(true);
              setShowThresholds(true);
              setShowDelineation(true);
            }}
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid #334155',
              color: '#cbd5e1',
              borderRadius: '6px',
              padding: '0.3rem 0.4rem',
              fontSize: '0.7rem',
              cursor: 'pointer',
            }}
          >
            Show All
          </button>
        </div>
      </div>
    </aside>
  );
}
