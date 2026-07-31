import type { SimulatePDEFormState } from './simulatePDE.types';

export function getSimulatePDEValidationMessage(form: SimulatePDEFormState) {
  if (form.xMax <= form.xMin) {
    return 'The x-range must have x max greater than x min.';
  }

  if (form.xStep <= 0) {
    return 'The x step must be greater than 0.';
  }

  if (form.spatialDimension === '2d' && form.yMax <= form.yMin) {
    return 'The y-range must have y max greater than y min.';
  }

  if (form.spatialDimension === '2d' && form.yStep <= 0) {
    return 'The y step must be greater than 0.';
  }

  if (form.hasTemporalDimension && form.tMax <= form.tMin) {
    return 'The t-range must have t max greater than t min.';
  }

  if (form.hasTemporalDimension && form.tStep <= 0) {
    return 'The t step must be greater than 0.';
  }

  return null;
}
