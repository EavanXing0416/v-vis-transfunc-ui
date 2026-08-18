import type { DatasetRecord } from '../datasets/dataset.types';
import { getDatasetDataObjectType } from '../datasets/dataObjectType';
import type { SigExMASTFormState } from './sigExMAST.types';

export const defaultSigExMASTForm: SigExMASTFormState = {
  campaign: 'MAST',
  shotSource: 'manual',
  selectedShotDatasetId: '',
  shotPath: '',
  manualShotIds: '',
  signals: ['ip', 'ne', 'dalpha', 'sxr_core'],
  customSignalKey: '',
  comments: '',
};

export function buildDefaultSigExMASTForm(datasets: DatasetRecord[]): SigExMASTFormState {
  const shotListDatasets = datasets.filter((dataset) => getDatasetDataObjectType(dataset) === 'IntegerList');

  return {
    ...defaultSigExMASTForm,
    shotSource: shotListDatasets.length > 0 ? 'input_dataset' : 'manual',
    selectedShotDatasetId: shotListDatasets[0]?.id ?? '',
  };
}
