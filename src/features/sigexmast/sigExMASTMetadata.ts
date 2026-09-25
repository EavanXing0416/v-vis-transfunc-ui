import type { DatasetRecord } from '../datasets/dataset.types';
import type { SigExMASTFormState } from './sigExMAST.types';

export function buildSigExMASTMetadataSummary(form: SigExMASTFormState) {
  return `Retrieved raw time series. Irregular sampling. Each data object represents one shot. Signals: ${form.signals.join(", ")}.`;
}

export function getSigExMASTOutputObjectCount(
  primaryDataset: DatasetRecord | null,
  shotListDatasets: DatasetRecord[],
  form: SigExMASTFormState,
  manualShotIds: string[],
) {
  if (form.shotSource === 'manual') {
    return manualShotIds.length;
  }

  if (form.shotSource === 'input_dataset') {
    return shotListDatasets.find((dataset) => dataset.id === form.selectedShotDatasetId)?.itemCount ?? Number.NaN;
  }

  return Number.NaN;
}
