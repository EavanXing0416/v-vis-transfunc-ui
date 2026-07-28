export type DatasetType = 'physical' | 'virtual';

export interface DatasetLabelClass {
  name: string;
  count: number;
}

export interface DatasetSelectMetadata {
  variableHeadings: string[];
  labelHeadings: string[];
  labelClassesByHeading: Record<string, DatasetLabelClass[]>;
}

export interface DatasetRecord {
  id: string;
  name: string;
  type: DatasetType;
  source: string;
  modality: string;
  keywordCount: number;
  objectCount: number;
  variableCount: number;
  labelCount: number;
  metadataSummary: string;
  selectMetadata?: DatasetSelectMetadata;
}
