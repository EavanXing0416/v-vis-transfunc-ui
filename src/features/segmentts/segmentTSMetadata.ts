import type { DatasetRecord } from '../datasets/dataset.types';
import type { SegmentTSFormState } from './segmentTS.types';

export interface SegmentTSCalculations {
  windowSamples: number | null;
  strideSamples: number | null;
  overlapPercent: number | null;
}

export function getSegmentTSCalculations(form: SegmentTSFormState): SegmentTSCalculations {
  const windowMs = Number(form.windowMs);
  const strideMs = Number(form.strideMs);
  const fsHz = Number(form.fsHz);

  if (!Number.isFinite(windowMs) || windowMs <= 0 || !Number.isFinite(strideMs) || strideMs <= 0 || !Number.isFinite(fsHz) || fsHz <= 0) {
    return { windowSamples: null, strideSamples: null, overlapPercent: null };
  }

  return {
    windowSamples: Math.round((windowMs * fsHz) / 1000),
    strideSamples: Math.round((strideMs * fsHz) / 1000),
    overlapPercent: ((windowMs - strideMs) / windowMs) * 100,
  };
}

export function buildSegmentTSMetadataSummary(form: SegmentTSFormState) {
  return `Sliding-window segmented, labelled time-series dataset. Each data object represents one time-series window derived from a shot. Window length: ${form.windowMs} ms. Stride: ${form.strideMs} ms. Sampling frequency: ${form.fsHz} Hz. Label associations are preserved.`;
}

export function getSegmentTSOutputObjectCount(_dataset: DatasetRecord | null) {
  return Number.NaN;
}
