/**
 * Structured Medical & Algorithmic Data for ECG Fundamentals.
 *
 * Medical claims use conservative, medically cautious language.
 * ECG reference values reflect typical adult ranges; clinical interpretation
 * depends on lead, age, sex, and clinical context.
 */

export const DISCLAIMER_TEXT =
  'Educational visualization only. ECG findings require clinical context and qualified medical interpretation.';

/**
 * P-Q-R-S-T & Interval Definitions
 */
export const WAVEFORM_COMPONENTS = {
  p_wave: {
    id: 'p_wave',
    name: 'P Wave',
    shortName: 'P',
    color: '#38bdf8', // Sky blue
    anatomicalPhase: 'Atrial Depolarization',
    conductionOrigin: 'Sinoatrial (SA) node to atrial myocardium',
    typicalRange: 'Typical adult reference range: < 120 ms duration, < 0.25 mV amplitude (lead II)',
    physiologicalMeaning:
      'Represents electrical activation (depolarization) of both atria, which initiates atrial mechanical contraction.',
    clinicalSignificance:
      'Can show altered amplitude or duration in atrial enlargement; loss of organized P waves is commonly seen in atrial fibrillation.',
    panTompkinsRelevance:
      'Low in frequency (< 5 Hz) and modest in slope (dV/dt). Bandpass filtering attenuates it, and derivative filtering suppresses it, preventing false QRS detections.',
  },
  pr_interval: {
    id: 'pr_interval',
    name: 'PR Interval',
    shortName: 'PR',
    color: '#818cf8', // Indigo
    anatomicalPhase: 'AV Nodal Conduction Delay',
    conductionOrigin: 'SA node → atria → AV node → His bundle',
    typicalRange: 'Typical adult reference range: 120–200 ms (rate-dependent)',
    physiologicalMeaning:
      'Measures the time from the beginning of atrial depolarization to the onset of ventricular depolarization, including the essential physiological delay at the AV node.',
    clinicalSignificance:
      'Prolongation (> 200 ms) can be seen in first-degree AV block; shortening (< 120 ms) may be associated with accessory pathways (such as pre-excitation patterns) or junctional rhythms.',
    panTompkinsRelevance:
      'Forms the temporal spacing between atrial activity and ventricular activation. Pan-Tompkins tracks RR intervals between consecutive QRS complexes rather than PR intervals directly.',
  },
  q_wave: {
    id: 'q_wave',
    name: 'Q Wave',
    shortName: 'Q',
    color: '#fbbf24', // Amber
    anatomicalPhase: 'Initial Septal Depolarization',
    conductionOrigin: 'Left bundle branch septal fascicle (left-to-right)',
    typicalRange: 'Typical adult reference range: < 40 ms duration, amplitude < 25% of succeeding R wave',
    physiologicalMeaning:
      'Initial negative deflection preceding the R peak, reflecting depolarization of the interventricular septum from left to right.',
    clinicalSignificance:
      'Small "septal" Q waves are normal in lateral leads; wide or deep pathological Q waves can be associated with previous myocardial infarction or focal fibrosis.',
    panTompkinsRelevance:
      'Marks the onset of the steep ventricular deflection. Differentiating this rapid descent provides the initial slope spike that triggers the squaring stage.',
  },
  r_wave: {
    id: 'r_wave',
    name: 'R Wave',
    shortName: 'R',
    color: '#ef4444', // Red/Crimson
    anatomicalPhase: 'Main Ventricular Depolarization',
    conductionOrigin: 'His-Purkinje network into ventricular free walls',
    typicalRange: 'Typical adult reference range: part of 80–120 ms QRS, amplitude ~0.5–2.5 mV (lead-dependent)',
    physiologicalMeaning:
      'The prominent positive deflection produced as the primary electrical wavefront spreads rapidly through the bulk of the left and right ventricular myocardium.',
    clinicalSignificance:
      'High voltages can be associated with ventricular hypertrophy or thin chest walls; reduced voltage may be seen in pericardial effusion, obesity, or infiltrative disease.',
    panTompkinsRelevance:
      'The primary target of the Pan-Tompkins algorithm. Possesses the steepest dV/dt in the entire cardiac cycle, creating the dominant energy peak in derivative and squared signals.',
  },
  s_wave: {
    id: 's_wave',
    name: 'S Wave',
    shortName: 'S',
    color: '#f97316', // Orange
    anatomicalPhase: 'Terminal Ventricular Depolarization',
    conductionOrigin: 'Basal regions of ventricles and upper septum',
    typicalRange: 'Typical adult reference range: part of 80–120 ms QRS, variable amplitude',
    physiologicalMeaning:
      'Negative deflection following the R peak, representing final depolarization of the basal posterolateral regions of the ventricles.',
    clinicalSignificance:
      'Deep S waves in anterior or lateral leads can be seen in right or left ventricular hypertrophy or intraventricular conduction delays.',
    panTompkinsRelevance:
      'The rapid transition from R to S and recovery back to baseline generates a second steep slope peak. Pointwise squaring makes it positive, and integration merges it with the R-wave contribution.',
  },
  qrs_complex: {
    id: 'qrs_complex',
    name: 'QRS Complex',
    shortName: 'QRS',
    color: '#ec4899', // Pink
    anatomicalPhase: 'Total Ventricular Depolarization',
    conductionOrigin: 'Entire His-Purkinje system & ventricular myocardium',
    typicalRange: 'Typical adult reference range: 80–120 ms (lead & age dependent)',
    physiologicalMeaning:
      'The composite electrical vector representing complete electrical depolarization of the ventricular chambers prior to mechanical systole.',
    clinicalSignificance:
      'Widened QRS (> 120 ms) can be seen with bundle branch blocks, ventricular pacing, hyperkalemia, or ectopic ventricular beats.',
    panTompkinsRelevance:
      'The central entity Pan-Tompkins is engineered to identify. Its high slope and concentrated ~10 Hz spectral power distinguish it from baseline noise and slower cardiac waves.',
  },
  st_segment: {
    id: 'st_segment',
    name: 'ST Segment',
    shortName: 'ST',
    color: '#a855f7', // Purple
    anatomicalPhase: 'Plateau Phase of Ventricular Repolarization',
    conductionOrigin: 'Uniformly depolarized ventricular myocytes (Phase 2 plateau)',
    typicalRange: 'Isoelectric baseline relative to PR segment (typically within ±0.1 mV)',
    physiologicalMeaning:
      'The relatively flat, isoelectric segment connecting the end of the S wave (J-point) to the beginning of the T wave, during which all ventricular cells remain depolarized.',
    clinicalSignificance:
      'Deviation from baseline (elevation or depression) may be associated with myocardial ischemia, acute injury patterns, pericarditis, or drug effects.',
    panTompkinsRelevance:
      'Possesses very low dV/dt (near-zero slope). Derivative filtering practically eliminates this segment, ensuring the detector does not trigger between the S and T waves.',
  },
  t_wave: {
    id: 't_wave',
    name: 'T Wave',
    shortName: 'T',
    color: '#10b981', // Emerald green
    anatomicalPhase: 'Ventricular Repolarization',
    conductionOrigin: 'Ventricular myocardium (epicardium to endocardium recovery)',
    typicalRange: 'Typical adult reference range: asymmetric upward curve, amplitude commonly < 0.5 mV',
    physiologicalMeaning:
      'Represents rapid repolarization of ventricular myocytes back to their resting membrane electrical potential in preparation for the next cycle.',
    clinicalSignificance:
      'Tall, peaked T waves can be seen in early ischemia or hyperkalemia; inverted or flattened T waves may be associated with ischemia, strain patterns, or hypokalemia.',
    panTompkinsRelevance:
      'Can occasionally exhibit large amplitude, posing a false-trigger risk. Pan-Tompkins prevents false T-wave detection using 200 ms refractory blanking, slope comparison, and dual threshold tracking.',
  },
  qt_interval: {
    id: 'qt_interval',
    name: 'QT Interval',
    shortName: 'QT',
    color: '#06b6d4', // Cyan
    anatomicalPhase: 'Total Ventricular Electrical Systole',
    conductionOrigin: 'Ventricular depolarization through complete repolarization',
    typicalRange: 'Common reference value: typically ≤ 440–460 ms (heart rate-dependent; QTc)',
    physiologicalMeaning:
      'Measures the complete duration from the beginning of ventricular depolarization (Q point) to the completion of repolarization (end of T wave).',
    clinicalSignificance:
      'Prolongation can be congenital or drug-induced and may increase vulnerability to polymorphic ventricular arrhythmias such as Torsades de Pointes.',
    panTompkinsRelevance:
      'Encompasses the entire ventricular refractory and recovery timeline, illustrating why algorithm search-back and refractory timing windows must be calibrated against physiological beat intervals.',
  },
};

/**
 * Conduction System Stages & Visual Flow
 */
export const CONDUCTION_PATHWAY = [
  {
    step: 1,
    id: 'sa_node',
    name: 'SA Node',
    role: 'Primary Pacemaker',
    description: 'Generates spontaneous rhythmic impulses at 60–100 bpm in healthy resting hearts.',
    ecgPhase: 'P Wave onset',
    color: '#38bdf8',
  },
  {
    step: 2,
    id: 'atria',
    name: 'Atrial Myocardium',
    role: 'Atrial Depolarization',
    description: 'Wavefront spreads through right and left atria, stimulating atrial contraction.',
    ecgPhase: 'P Wave body',
    color: '#60a5fa',
  },
  {
    step: 3,
    id: 'av_node',
    name: 'AV Node',
    role: 'Physiological Gatekeeper & Delay',
    description: 'Slows electrical conduction (~0.09–0.12 s), ensuring ventricular filling before contraction.',
    ecgPhase: 'PR Segment (isoelectric)',
    color: '#818cf8',
  },
  {
    step: 4,
    id: 'his_purkinje',
    name: 'His-Purkinje System',
    role: 'High-Velocity Conduction Tract',
    description: 'Conducts rapidly through Bundle of His, bundle branches, and extensive subendocardial Purkinje fibers.',
    ecgPhase: 'QRS Complex onset & rapid ascent',
    color: '#ec4899',
  },
  {
    step: 5,
    id: 'ventricles',
    name: 'Ventricular Myocardium',
    role: 'Ventricular Depolarization & Contraction',
    description: 'Rapid, coordinated activation of massive ventricular muscle mass, initiating mechanical systole.',
    ecgPhase: 'QRS Peak & S Wave completion',
    color: '#ef4444',
  },
];

/**
 * Waveform Abnormality Catalog (Categorized)
 */
export const ABNORMALITY_DATA = [
  // P Wave Abnormalities
  {
    id: 'abn_p_absent',
    category: 'P',
    title: 'Absent / Fibrillatory P Waves',
    badge: 'Rhythm Pattern',
    visualDescription: 'Chaotic, irregular baseline oscillations without identifiable discrete P waves.',
    possibleAssociations:
      'Can be seen in atrial fibrillation, junctional rhythms, or severe hyperkalemia.',
    whyItMatters:
      'Loss of coordinated atrial contraction; requires careful assessment for thromboembolic risk and ventricular rate control.',
    panTompkinsImpact:
      'Irregular RR intervals challenge running average estimates, but high-slope QRS complexes remain reliably detectable.',
  },
  {
    id: 'abn_p_flutter',
    category: 'P',
    title: 'Sawtooth Flutter Waves',
    badge: 'Rhythm Pattern',
    visualDescription: 'Continuous, regular saw-tooth baseline deflections (often ~250–350 bpm in leads II, III, aVF).',
    possibleAssociations:
      'Commonly associated with typical macro-reentrant atrial flutter.',
    whyItMatters:
      'Atrial rate is very fast; conduction ratio (e.g. 2:1 or 4:1) determines the effective ventricular rate.',
    panTompkinsImpact:
      'Flutter waves have moderate slope; bandpass and derivative filters keep them below threshold while detecting the QRS.',
  },
  {
    id: 'abn_p_pulmonale',
    category: 'P',
    title: 'Tall Peaked P Waves (P Pulmonale)',
    badge: 'Morphological Finding',
    visualDescription: 'P-wave amplitude exceeding 0.25 mV in inferior leads (II, III, aVF).',
    possibleAssociations:
      'Can be associated with right atrial enlargement, chronic pulmonary disease, or pulmonary hypertension.',
    whyItMatters:
      'Indicates possible structural remodeling or pressure overload in the right heart chambers.',
    panTompkinsImpact:
      'Even when amplitude is increased, the slope remains lower than the rapid QRS deflection.',
  },

  // PR Interval Abnormalities
  {
    id: 'abn_pr_prolonged',
    category: 'PR',
    title: 'Prolonged PR Interval (> 200 ms)',
    badge: 'Conduction Abnormality',
    visualDescription: 'PR interval exceeds 200 ms, with 1:1 AV conduction preserved.',
    possibleAssociations:
      'May be seen in first-degree atrioventricular (AV) delay, high vagal tone, or AV-nodal blocking medications.',
    whyItMatters:
      'Reflects slowed conduction through the AV node or His-Purkinje system; usually benign when isolated.',
    panTompkinsImpact:
      'Does not interfere with QRS detection, as Pan-Tompkins identifies the QRS peak independently of PR duration.',
  },
  {
    id: 'abn_pr_short_delta',
    category: 'PR',
    title: 'Short PR with Delta Wave',
    badge: 'Pre-excitation Pattern',
    visualDescription: 'PR interval < 120 ms with a slurred initial upstroke (delta wave) on the QRS.',
    possibleAssociations:
      'Suggestive of ventricular pre-excitation (e.g. Wolff-Parkinson-White pattern) via an accessory pathway.',
    whyItMatters:
      'Impulses bypass normal AV nodal delay; can lead to rapid ventricular rates during atrial arrhythmias.',
    panTompkinsImpact:
      'The initial slurred delta wave slightly broadens the QRS and increases moving-window integrated peak width.',
  },

  // QRS Complex Abnormalities
  {
    id: 'abn_qrs_wide_bbb',
    category: 'QRS',
    title: 'Widened QRS (> 120 ms) / Bundle Branch Block',
    badge: 'Conduction Abnormality',
    visualDescription: 'QRS duration ≥ 120 ms with notched or broadened morphology.',
    possibleAssociations:
      'Can be seen in left or right bundle branch block, ventricular pacing, or severe metabolic disturbance.',
    whyItMatters:
      'Indicates asynchronous or abnormal ventricular conduction that impairs mechanical efficiency.',
    panTompkinsImpact:
      'Wider complexes yield a broader integrated window peak; moving window (~150 ms) easily accommodates wider complexes.',
  },
  {
    id: 'abn_qrs_pvc',
    category: 'QRS',
    title: 'Premature Ventricular Complex (PVC)',
    badge: 'Ectopic Beat',
    visualDescription: 'Early, wide, and bizarre QRS without preceding P wave, often followed by a compensatory pause.',
    possibleAssociations:
      'May occur in healthy individuals or be associated with ischemic, hypertensive, or cardiomyopathic conditions.',
    whyItMatters:
      'Frequent or complex ventricular ectopy can require clinical investigation depending on symptoms and underlying heart health.',
    panTompkinsImpact:
      'Exhibits very large amplitude and broad duration, creating a prominent integrated peak that Pan-Tompkins detects readily.',
  },
  {
    id: 'abn_qrs_path_q',
    category: 'QRS',
    title: 'Pathological Q Waves',
    badge: 'Morphological Finding',
    visualDescription: 'Q wave duration ≥ 40 ms or depth > 25% of the following R wave.',
    possibleAssociations:
      'Can be associated with prior myocardial infarction, transmural necrosis, or infiltrative myocardial processes.',
    whyItMatters:
      'Signifies electrically silent/non-viable myocardium in the corresponding anatomical territory.',
    panTompkinsImpact:
      'Deep negative deflections provide steep initial slopes; squaring converts them to positive energy peaks.',
  },

  // ST Segment Abnormalities
  {
    id: 'abn_st_elevation',
    category: 'ST',
    title: 'ST-Segment Elevation',
    badge: 'Ischemia / Injury Pattern',
    visualDescription: 'J-point and ST segment elevated above the isoelectric baseline.',
    possibleAssociations:
      'May be associated with acute transmural myocardial ischemia/injury, acute pericarditis, or normal variant early repolarization.',
    whyItMatters:
      'Critical time-sensitive marker when accompanied by ischemic symptoms; requires prompt clinical correlation.',
    panTompkinsImpact:
      'Elevated ST levels represent low-frequency baseline shifts; bandpass filtering reduces them and derivative slope ignores the plateau.',
  },
  {
    id: 'abn_st_depression',
    category: 'ST',
    title: 'ST-Segment Depression',
    badge: 'Ischemia / Strain Pattern',
    visualDescription: 'Horizontal or downsloping displacement of the ST segment below the isoelectric line.',
    possibleAssociations:
      'Can be seen in subendocardial ischemia, ventricular strain patterns, hypokalemia, or digitalis effect.',
    whyItMatters:
      'Important indicator of myocardial supply-demand mismatch or reciprocal changes in ischemia.',
    panTompkinsImpact:
      'Near-zero slope throughout the ST depression prevents false triggers in the Pan-Tompkins differentiator.',
  },

  // T / QT Wave Abnormalities
  {
    id: 'abn_t_tall_peaked',
    category: 'T_QT',
    title: 'Tall, Peaked T Waves',
    badge: 'Repolarization Abnormality',
    visualDescription: 'Symmetrical, narrow, high-amplitude "tented" T waves.',
    possibleAssociations:
      'Commonly associated with hyperkalemia or hyperacute early phase of myocardial infarction.',
    whyItMatters:
      'Electrolyte disturbances such as severe hyperkalemia can progress to life-threatening ventricular arrhythmias.',
    panTompkinsImpact:
      'High-amplitude T waves can risk double-counting if slope is steep. The 200 ms refractory blanking and derivative comparison safeguard against this.',
  },
  {
    id: 'abn_qt_prolonged',
    category: 'T_QT',
    title: 'Prolonged QT Interval',
    badge: 'Repolarization Delay',
    visualDescription: 'Interval from Q onset to T termination is extended relative to heart rate (QTc > 460–480 ms).',
    possibleAssociations:
      'May be congenital (Long QT Syndrome) or acquired due to electrolyte abnormalities (hypokalemia, hypomagnesemia) or medications.',
    whyItMatters:
      'Increases susceptibility to early afterdepolarizations and polymorphic ventricular tachycardia (Torsades de Pointes).',
    panTompkinsImpact:
      'Illustrates the long refractory span of ventricular cells; Pan-Tompkins operates primarily on the initial QRS trigger point.',
  },
];

/**
 * 5-Stage Pan-Tompkins Transformation Pipeline
 */
export const PAN_TOMPKINS_STAGES = [
  {
    id: 'raw',
    step: 1,
    title: 'Raw ECG',
    shortTitle: 'Raw',
    color: '#3b82f6',
    mathFormula: 'x[n]',
    purpose: 'Acquired physiological recording',
    explanation:
      'The digitized surface voltage signal containing cardiac electrical activity along with physiological artifacts such as baseline wander and muscle tremor.',
    characteristics:
      'Contains P, QRS, and T waves. QRS amplitude and morphology vary across leads, and baseline drift may be present.',
  },
  {
    id: 'bandpass',
    step: 2,
    title: 'Bandpass Filter',
    shortTitle: 'Bandpass',
    color: '#06b6d4',
    mathFormula: 'H_{bp}(z) = H_{lp}(z) \\cdot H_{hp}(z)',
    purpose: 'Isolates QRS energy frequency band',
    explanation:
      'Emphasizes the frequency range characteristic of QRS complexes (typically 5–15 Hz in the classic design, configurable in this app) while attenuating low-frequency respiratory drift and high-frequency EMG noise.',
    characteristics:
      'Reduces baseline drift and high-frequency noise; rounds and attenuates slower P and T wave components relative to the sharp QRS.',
  },
  {
    id: 'derivative',
    step: 3,
    title: 'Five-Point Derivative',
    shortTitle: 'Derivative',
    color: '#a855f7',
    mathFormula: 'y[n] = \\frac{1}{8T} (2x[n] + x[n-1] - x[n-3] - 2x[n-4])',
    purpose: 'Extracts high-slope edge information',
    explanation:
      'Calculates the rate of voltage change (dV/dt). Because the QRS complex has the steepest rising and falling edges, it generates large positive and negative deflections, while flatter P and T waves are suppressed toward zero.',
    characteristics:
      'Suppresses flat and slowly changing waveforms; produces paired positive and negative peaks for the rising and falling edges of the QRS.',
  },
  {
    id: 'squaring',
    step: 4,
    title: 'Pointwise Squaring',
    shortTitle: 'Squaring',
    color: '#ec4899',
    mathFormula: 'y[n] = (x[n])^2',
    purpose: 'Nonlinear amplification & positivity',
    explanation:
      'Makes all values strictly positive and nonlinearly amplifies large slopes while suppressing smaller residual noise fluctuations.',
    characteristics:
      'Converts negative deflections (such as S waves or derivative downward swings) into positive peaks and strongly separates QRS slopes from baseline ripples.',
  },
  {
    id: 'integration',
    step: 5,
    title: 'Moving-Window Integration',
    shortTitle: 'Integration',
    color: '#10b981',
    mathFormula: 'y[n] = \\frac{1}{N} \\sum_{k=0}^{N-1} x[n - (N-1) + k]',
    purpose: 'Consolidates slope & duration energy',
    explanation:
      'Averages the squared derivative over a sliding window (~150 ms, configurable). This merges the distinct slope spikes into a single smooth, consolidated waveform pulse for threshold detection.',
    characteristics:
      'Produces a single distinct peak corresponding to each QRS complex. The height and width reflect both the slope energy and duration of the complex.',
  },
];

/**
 * Teaching Simulator Presets for ECGLab
 * (Deterministic client-side waveforms for educational demonstration)
 */
export const SIMULATOR_PRESETS = [
  {
    id: 'nsr',
    name: 'Normal Sinus Rhythm',
    badge: 'Baseline Rhythm',
    subtitle: 'Regular rhythm, distinct P waves, narrow QRS complexes',
    heartRateBpm: 72,
    ecgChanges:
      'Typical normal morphology: rounded upright P wave, sharp high-amplitude QRS (< 120 ms), and gentle asymmetric T wave.',
    pipelineResponse:
      'High dV/dt in the QRS produces sharp derivative spikes. Integration yields a single distinct peak well above the adaptive threshold.',
    safeguards:
      'Standard dual-threshold tracking (SPKI/NPKI) reliably maintains separation between signal peaks and noise baseline.',
  },
  {
    id: 'afib',
    name: 'AF-like Educational Waveform',
    badge: 'Irregular Rhythm Example',
    subtitle: 'Irregular beat intervals with baseline fibrillatory ripples',
    heartRateBpm: 95,
    ecgChanges:
      'Irregularly irregular RR intervals; discrete P waves are absent and replaced by subtle baseline fibrillatory oscillations.',
    pipelineResponse:
      'Baseline fibrillatory ripples are reduced by the bandpass filter and derivative stage, allowing the sharp QRS peaks to dominate the integrated output.',
    safeguards:
      'Because RR intervals vary unpredictably, the algorithm dual running RR averages adapt dynamically to prevent premature search-back triggers.',
  },
  {
    id: 'pvc',
    name: 'Premature Ventricular Beat Example',
    badge: 'Morphology Variation',
    subtitle: 'Early, widened, bizarre complex followed by a compensatory pause',
    heartRateBpm: 75,
    ecgChanges:
      'An early ectopic beat occurs with widened duration (> 140 ms) and large amplitude, lacking a preceding P wave.',
    pipelineResponse:
      'The widened, high-voltage complex creates a very large integrated energy pulse due to both its high slope and prolonged duration.',
    safeguards:
      'The 200 ms physiological blanking prevents multi-triggering on wide bizarre complexes, while the subsequent compensatory pause is accommodated by the search-back threshold.',
  },
  {
    id: 'st_elevation',
    name: 'ST-Segment Elevation Example',
    badge: 'Repolarization Deviation',
    subtitle: 'Elevated J-point with high-takeoff ST segment',
    heartRateBpm: 70,
    ecgChanges:
      'The J-point and ST segment are elevated significantly above the isoelectric baseline, merging smoothly into the upright T wave.',
    pipelineResponse:
      'The elevated ST segment is relatively flat (low dV/dt), so derivative filtering effectively suppresses it, focusing solely on the preceding steep QRS edges.',
    safeguards:
      'Bandpass filtering attenuates the low-frequency plateau, demonstrating why Pan-Tompkins is robust against ischemic ST deviations.',
  },
  {
    id: 'tall_t',
    name: 'Tall/Tented T-Wave Example',
    badge: 'High-Amplitude T Wave',
    subtitle: 'High-amplitude, symmetrical, narrow peaked T wave',
    heartRateBpm: 68,
    ecgChanges:
      'T-wave voltage is elevated and peaked, approaching the height of the R wave.',
    pipelineResponse:
      'Because the T wave has a steeper slope than usual, it produces a noticeable secondary bump in the derivative and squared waveforms.',
    safeguards:
      'Pan-Tompkins relies on 200 ms refractory blanking and slope comparison (verifying whether derivative dV/dt < 0.5 of preceding QRS) to avoid double-counting the T wave.',
  },
];
