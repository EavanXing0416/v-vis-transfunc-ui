import type { DatasetRecord } from './dataset.types';

export function getDatasetDataObjectType(dataset: Pick<DatasetRecord, 'name' | 'modality' | 'dataObjectType'>) {
  if (dataset.dataObjectType?.trim()) {
    return dataset.dataObjectType.trim();
  }

  const modality = dataset.modality.toLowerCase();
  const name = dataset.name.toLowerCase();

  if (modality.includes('field')) {
    return 'Field';
  }

  if (modality.includes('image')) {
    return 'Image';
  }

  if (modality.includes('audio')) {
    return 'Audio clip';
  }

  if (modality.includes('signal')) {
    return 'Time-series signal';
  }

  if (modality.includes('annotation') || modality.includes('table') || name.includes('shot list')) {
    return 'Tabular record';
  }

  if (modality.includes('scada') || modality.includes('event collection')) {
    return 'Tabular time-series event';
  }

  return dataset.modality;
}
