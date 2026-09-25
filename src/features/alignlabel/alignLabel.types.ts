export type AlignLabelAnnotationSource = 'input_dataset' | 'input_path';
export type AlignLabelRule = 'overlap' | 'centre_in_event';
export type AlignLabelEventType = 'elms' | 'ires' | 'sawteeth' | 'confinement';

export interface AlignLabelFormState {
  timeSeriesDatasetId: string;
  annotationSource: AlignLabelAnnotationSource;
  annotationDatasetId: string;
  labelFilePath: string;
  labellingRule: AlignLabelRule;
  disruptionClipS: string;
  annotationSpanMarginMs: string;
  eventType: AlignLabelEventType;
  comments: string;
}
