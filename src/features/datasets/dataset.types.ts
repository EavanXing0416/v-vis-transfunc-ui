export type DatasetType = 'physical' | 'virtual';

export interface DatasetRecord {
  id: string;
  name: string;
  type: DatasetType;
  source: string;
  modality: string;
  keywordCount: number;
  objectCount: number;
  metadataSummary: string;
}
