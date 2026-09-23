import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ECGFundamentals from './ECGFundamentals';
import HeroSection from './HeroSection';
import ConductionPathway from './ConductionPathway';
import AbnormalityExplorer from './AbnormalityExplorer';
import PanTompkinsConnection from './PanTompkinsConnection';
import ECGLab from './ECGLab';
import {
  WAVEFORM_COMPONENTS,
  CONDUCTION_PATHWAY,
  ABNORMALITY_DATA,
  PAN_TOMPKINS_STAGES,
  SIMULATOR_PRESETS,
  DISCLAIMER_TEXT,
} from './ecgData';

describe('ECG Fundamentals Educational Module', () => {
  describe('Structured Data Integrity (ecgData.js)', () => {
    it('contains all required P-Q-R-S-T waves and interval definitions', () => {
      const requiredKeys = [
        'p_wave',
        'pr_interval',
        'q_wave',
        'r_wave',
        's_wave',
        'qrs_complex',
        'st_segment',
        't_wave',
        'qt_interval',
      ];

      requiredKeys.forEach((key) => {
        const item = WAVEFORM_COMPONENTS[key];
        expect(item, `Missing waveform component: ${key}`).toBeDefined();
        expect(item.name).toBeTruthy();
        expect(item.anatomicalPhase).toBeTruthy();
        expect(item.typicalRange).toBeTruthy();
        expect(item.physiologicalMeaning).toBeTruthy();
        expect(item.clinicalSignificance).toBeTruthy();
        expect(item.panTompkinsRelevance).toBeTruthy();
      });
    });

    it('defines the 5 sequential cardiac conduction steps', () => {
      expect(CONDUCTION_PATHWAY.length).toBe(5);
      expect(CONDUCTION_PATHWAY[0].name).toBe('SA Node');
      expect(CONDUCTION_PATHWAY[1].name).toBe('Atrial Myocardium');
      expect(CONDUCTION_PATHWAY[2].name).toBe('AV Node');
      expect(CONDUCTION_PATHWAY[3].name).toBe('His-Purkinje System');
      expect(CONDUCTION_PATHWAY[4].name).toBe('Ventricular Myocardium');
    });

    it('contains structured abnormalities categorized across P, PR, QRS, ST, T_QT', () => {
      expect(ABNORMALITY_DATA.length).toBeGreaterThanOrEqual(10);
      const categories = new Set(ABNORMALITY_DATA.map((a) => a.category));
      expect(categories.has('P')).toBe(true);
      expect(categories.has('PR')).toBe(true);
      expect(categories.has('QRS')).toBe(true);
      expect(categories.has('ST')).toBe(true);
      expect(categories.has('T_QT')).toBe(true);

      ABNORMALITY_DATA.forEach((abn) => {
        expect(abn.id).toBeTruthy();
        expect(abn.title).toBeTruthy();
        expect(abn.visualDescription).toBeTruthy();
        expect(abn.possibleAssociations).toBeTruthy();
        expect(abn.whyItMatters).toBeTruthy();
        expect(abn.panTompkinsImpact).toBeTruthy();
      });
    });

    it('defines all 5 Pan-Tompkins transformation stages in exact order', () => {
      expect(PAN_TOMPKINS_STAGES.length).toBe(5);
      const stageIds = PAN_TOMPKINS_STAGES.map((s) => s.id);
      expect(stageIds).toEqual(['raw', 'bandpass', 'derivative', 'squaring', 'integration']);

      PAN_TOMPKINS_STAGES.forEach((stg, idx) => {
        expect(stg.step).toBe(idx + 1);
        expect(stg.mathFormula).toBeTruthy();
        expect(stg.purpose).toBeTruthy();
        expect(stg.explanation).toBeTruthy();
      });
    });

    it('contains the 5 educational presets for the simulator', () => {
      expect(SIMULATOR_PRESETS.length).toBe(5);
      const presetIds = SIMULATOR_PRESETS.map((p) => p.id);
      expect(presetIds).toEqual(['nsr', 'afib', 'pvc', 'st_elevation', 'tall_t']);
    });

    it('contains the conservative medical disclaimer text', () => {
      expect(DISCLAIMER_TEXT).toContain('Educational visualization only');
      expect(DISCLAIMER_TEXT).toContain('clinical context');
    });
  });

  describe('Component Rendering', () => {
    it('renders HeroSection with title, subtitle, and interactive waveform', () => {
      const html = renderToStaticMarkup(React.createElement(HeroSection));
      expect(html).toContain('ECG Fundamentals');
      expect(html).toContain('Understand the electrical story behind every QRS complex.');
      expect(html).toContain('Lead II Idealized Cardiac Cycle');
      expect(html).toContain('Viewing:');
    });

    it('renders ConductionPathway with all 5 anatomical stages and link to workspace', () => {
      const html = renderToStaticMarkup(
        React.createElement(ConductionPathway, { onOpenWorkspace: () => {} })
      );
      expect(html).toContain('Cardiac Conduction Pathway');
      expect(html).toContain('SA Node');
      expect(html).toContain('AV Node');
      expect(html).toContain('His-Purkinje System');
      expect(html).toContain('Open 3D Heart Visualizer');
    });

    it('renders AbnormalityExplorer with category filters and educational disclaimer', () => {
      const html = renderToStaticMarkup(React.createElement(AbnormalityExplorer));
      expect(html).toContain('Waveform Abnormality Atlas');
      expect(html).toContain('All Findings');
      expect(html).toContain('P Wave');
      expect(html).toContain('QRS Complex');
      expect(html).toContain(DISCLAIMER_TEXT);
    });

    it('renders PanTompkinsConnection with core algorithmic message', () => {
      const html = renderToStaticMarkup(
        React.createElement(PanTompkinsConnection, { onOpenWorkspace: () => {} })
      );
      expect(html).toContain('Why does Pan-Tompkins care about the QRS complex?');
      expect(html).toContain(
        'The goal is not to diagnose every ECG abnormality. The goal is to reliably identify QRS complexes.'
      );
      expect(html).toContain('Derivative');
      expect(html).toContain('Integration');
    });

    it('renders ECGLab with 3 synchronized traces and preset buttons', () => {
      const html = renderToStaticMarkup(React.createElement(ECGLab));
      expect(html).toContain('Interactive ECG Lab: 3 Synchronized Traces');
      expect(html).toContain('1. Original Simulated ECG');
      expect(html).toContain('2. Bandpass Filtered Signal (5–15 Hz)');
      expect(html).toContain('3. Moving-Window Integrated Signal');
      expect(html).toContain('What changes in the ECG?');
      expect(html).toContain('How does the Pan-Tompkins pipeline respond?');
      expect(html).toContain('Normal Sinus Rhythm');
      expect(html).toContain('AF-like Educational Waveform');
    });

    it('renders full master ECGFundamentals component without throwing', () => {
      const html = renderToStaticMarkup(
        React.createElement(ECGFundamentals, { onOpenWorkspace: () => {} })
      );
      expect(html).toContain('ECG Educational Module');
      expect(html).toContain('Waveform Anatomy');
      expect(html).toContain('Cardiac Conduction');
      expect(html).toContain('Back to Workspace');
    });
  });
});
