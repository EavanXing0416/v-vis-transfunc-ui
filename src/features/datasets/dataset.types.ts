export type DatasetType = 'physical' | 'virtual';
export type SelectValueType = 'categorical' | 'numerical' | 'text';

export interface DatasetLabelClass {
  name: string;
  count: number;
}

export interface DatasetSelectMetadata {
  labelHeadings: string[];
  labelClassesByHeading: Record<string, DatasetLabelClass[]>;
  labelSource?: string;
  columnNames?: string[];
  columnValueTypes?: Record<string, SelectValueType>;
}

export interface DatasetRecord {
  id: string;
  name: string;
  type: DatasetType;
  source: string;
  modality: string;
  dataObjectType?: string;
  filePath?: string;
  keywordCount: number;
  objectCount: number;
  itemCount?: number;
  variableCount: number;
  labelCount: number;
  metadataSummary: string;
  readmeContent?: string;
  selectMetadata?: DatasetSelectMetadata;
}
