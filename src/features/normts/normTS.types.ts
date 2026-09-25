export type NormTSMethod = 'robust_zscore' | 'standard_scaler';
export type NormTSFitScope = 'per_shot' | 'per_cv_fold';

export interface NormTSFormState {
  method: NormTSMethod;
  epsilon: string;
  fitScope: NormTSFitScope;
  comments: string;
}
