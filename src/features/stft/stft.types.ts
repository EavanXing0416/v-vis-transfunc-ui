export interface STFTFormState {
  sampleRate: number;
  fftSize: number;
  windowLength: number;
  hopLength: number;
  windowType: 'hann' | 'hamming' | 'rectangular';
  storedComponents: 'complex' | 'magnitude' | 'phase' | 'magnitude_phase';
  applyToLabels: boolean;
  comments: string;
}
