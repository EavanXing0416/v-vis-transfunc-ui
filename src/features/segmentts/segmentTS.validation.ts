import type { SegmentTSFormState } from './segmentTS.types';

export function getSegmentTSValidationMessage(form: SegmentTSFormState) {
  const windowMs = Number(form.windowMs);
  const strideMs = Number(form.strideMs);
  const fsHz = Number(form.fsHz);

  if (!form.windowMs.trim() || !Number.isFinite(windowMs) || windowMs <= 0) {
    return 'window_ms must be greater than 0.';
  }

  if (!form.strideMs.trim() || !Number.isFinite(strideMs) || strideMs <= 0) {
    return 'stride_ms must be greater than 0.';
  }

  if (!form.fsHz.trim() || !Number.isInteger(fsHz) || fsHz <= 0) {
    return 'fs_hz must be a positive whole number.';
  }

  if (Math.round((windowMs * fsHz) / 1000) < 1) {
    return 'window_ms and fs_hz must produce at least 1 sample per window.';
  }

  if (Math.round((strideMs * fsHz) / 1000) < 1) {
    return 'stride_ms and fs_hz must produce a stride of at least 1 sample.';
  }

  return null;
}
