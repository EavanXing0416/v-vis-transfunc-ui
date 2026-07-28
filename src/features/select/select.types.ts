import type { DatasetLabelClass } from '../datasets/dataset.types';

export type SelectScope = 'across' | 'within';
export type SelectMode = 'labels' | 'variables';
export type SelectOperator = 'equals' | 'notEquals' | 'in' | 'gt' | 'lt' | 'between';
export type SelectConnector = 'AND' | 'OR';
export type VariableValueType = 'categorical' | 'numerical';

export interface SelectOperationDraft {
  scope: SelectScope;
  mode: SelectMode;
  field: string;
  operator: SelectOperator;
  values: string[];
  minValue: string;
  maxValue: string;
  connectorToNext: SelectConnector;
}

export interface SelectFormState {
  outputName: string;
  draftStep: SelectOperationDraft;
  operations: SelectOperationDraft[];
  comments: string;
}

export interface SelectDatasetSchema {
  variableHeadings: string[];
  labelHeadings: string[];
  labelClassesByHeading: Record<string, DatasetLabelClass[]>;
  variableValueTypes?: Record<string, VariableValueType>;
}
