export interface STFTFormState {
  sampleRate: number;
  fftSize: number;
  windowLength: number;
  hopLength: number;
  windowType: 'hann' | 'hamming' | 'rectangular';
  applyToLabels: boolean;
  comments: string;
}
