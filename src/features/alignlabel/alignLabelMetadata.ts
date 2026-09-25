import type { DatasetRecord } from '../datasets/dataset.types';
import type { AlignLabelFormState } from './alignLabel.types';

export function buildAlignLabelMetadataSummary(
  form: AlignLabelFormState,
  timeSeriesDataset: Pick<DatasetRecord, 'objectCount' | 'itemCount'> | null,
) {
  const objectCount = Number.isFinite(timeSeriesDataset?.objectCount) ? timeSeriesDataset?.objectCount : null;
  const countText = objectCount === null ? '' : `${objectCount} data objects. Each data object represents one shot. `;

  return `${formatEventType(form.eventType)}-labelled multivariate time-series dataset. ${countText}Event annotations are aligned to each shot using its retained t_flat_start. Labelling rule: ${form.labellingRule}.`;
}

export function getAlignLabelOutputObjectCount(dataset: DatasetRecord | null) {
  return dataset?.objectCount ?? Number.NaN;
}

function formatEventType(value: AlignLabelFormState['eventType']) {
  if (value === 'elms') return 'ELM';
  if (value === 'ires') return 'IRE';
  if (value === 'sawteeth') return 'Sawteeth';
  return 'Confinement';
}
