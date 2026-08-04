import type { DatasetRecord } from '../datasets/dataset.types';
import type { STFTFormState } from './stft.types';

export const defaultSTFTForm: STFTFormState = {
  sampleRate: 16000,
  fftSize: 512,
  windowLength: 512,
  hopLength: 128,
  windowType: 'hann',
  storedComponents: 'magnitude',
  applyToLabels: true,
  comments: '',
};

export function buildDefaultSTFTForm(dataset?: DatasetRecord): STFTFormState {
  const metadata = dataset?.metadataSummary.toLowerCase() ?? '';
  const hasLabels = metadata.includes('labels recorded:') || metadata.includes('label per data object') || dataset?.labelCount;

  return {
    ...defaultSTFTForm,
    applyToLabels: Boolean(hasLabels),
  };
}
