export interface AlignTSFormState {
  tMin: number;
  tMax: string;
  dt: number;
  method: 'nearest' | 'linear' | 'cubic' | 'zero';
  comments: string;
}
