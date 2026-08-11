import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { DerivedDatasetDraft, STFTTransformationRecord } from '../transformations/transformation.types';
import type { STFTFormState } from './stft.types';

export function buildSTFTPayload(
  dataset: DatasetRecord,
  form: STFTFormState,
  derivedDataset: DerivedDatasetDraft,
): STFTTransformationRecord {
  return {
    transformation_id: createTransformationId(),
    operation: 'STFT',
    status: 'ready',
    created_at: new Date().toISOString(),
    input_datasets: [{
      id: dataset.id,
      name: dataset.name,
      type: dataset.type,
      objectCount: dataset.objectCount,
      metadataSummary: dataset.metadataSummary,
      modality: dataset.modality,
      dataObjectType: dataset.dataObjectType,
      selectMetadata: dataset.selectMetadata,
    }],
    stft: {
      sample_rate: form.sampleRate,
      fft_size: form.fftSize,
      window_length: form.windowLength,
      hop_length: form.hopLength,
      window_type: form.windowType,
      apply_to_labels: form.applyToLabels,
    },
    comments: form.comments,
    derived_dataset_count: 1,
    derived_datasets: [derivedDataset],
  };
}
