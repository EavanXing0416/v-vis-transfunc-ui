import { formatObjectCountDisplay } from '../../lib/objectCount';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { AlignTSFormState } from './alignTS.types';

export function buildAlignTSMetadataSummary(form: AlignTSFormState) {
  const tMaxText = form.tMax.trim() ? form.tMax.trim() : 'signal max';
  return `Aligned time-series signals. Each data object represents one shot. Uniform grid from t_min = ${form.tMin} to t_max = ${tMaxText} with dt = ${form.dt}. Interpolation: ${form.method}.`;
}

export function getAlignTSOutputObjectCount(dataset: DatasetRecord | null) {
  return dataset?.objectCount ?? Number.NaN;
}

export function formatAlignTSObjectCount(value: number) {
  return formatObjectCountDisplay(value);
}
