import { getDatasetDataObjectType } from '../datasets/dataObjectType';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { AlignLabelFormState } from './alignLabel.types';

export function buildDefaultAlignLabelForm(datasets: DatasetRecord[]): AlignLabelFormState {
  const timeSeriesDataset = datasets.find((dataset) => getDatasetDataObjectType(dataset) === 'TimeSeries');
  const annotationDataset = datasets.find((dataset) => getDatasetDataObjectType(dataset) === 'EventAnnotation');

  return {
    timeSeriesDatasetId: timeSeriesDataset?.id ?? '',
    annotationSource: annotationDataset ? 'input_dataset' : 'input_path',
    annotationDatasetId: annotationDataset?.id ?? '',
    labelFilePath: annotationDataset?.filePath ?? '',
    labellingRule: 'overlap',
    disruptionClipS: '',
    annotationSpanMarginMs: '',
    eventType: 'elms',
    comments: '',
  };
}
