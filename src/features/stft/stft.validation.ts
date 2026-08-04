import type { STFTFormState } from './stft.types';

export function getSTFTValidationMessage(form: STFTFormState) {
  if (form.sampleRate <= 0) {
    return 'Sample rate must be greater than 0.';
  }

  if (form.fftSize <= 0) {
    return 'FFT size must be greater than 0.';
  }

  if (form.windowLength <= 0) {
    return 'Window length must be greater than 0.';
  }

  if (form.hopLength <= 0) {
    return 'Hop length must be greater than 0.';
  }

  if (form.windowLength > form.fftSize) {
    return 'Window length should be less than or equal to FFT size.';
  }

  if (form.hopLength > form.windowLength) {
    return 'Hop length should be less than or equal to window length.';
  }

  return null;
}
