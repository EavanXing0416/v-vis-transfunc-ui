export const SIGEXMAST_DEFAULT_SIGNALS = ['ip', 'ne', 'dalpha', 'sxr_core'] as const;

export type SigExMASTDefaultSignal = (typeof SIGEXMAST_DEFAULT_SIGNALS)[number];
export type SigExMASTCampaign = 'MAST' | 'MAST-U';
export type SigExMASTShotSource = 'input_dataset' | 'input_path' | 'manual';

export interface SigExMASTFormState {
  campaign: SigExMASTCampaign;
  shotSource: SigExMASTShotSource;
  selectedShotDatasetId: string;
  shotPath: string;
  manualShotIds: string;
  signals: string[];
  customSignalKey: string;
  comments: string;
}
