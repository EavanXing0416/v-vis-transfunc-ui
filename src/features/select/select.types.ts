import type { DatasetLabelClass, SelectValueType } from '../datasets/dataset.types';

export type SelectScope = 'across' | 'within';
export type SelectMode = 'labels' | 'variables';
export type SelectOperator = 'equals' | 'notEquals' | 'in' | 'gt' | 'lt' | 'between';
export type SelectConnector = 'AND' | 'OR';
export type VariableValueType = SelectValueType;
export type LabelSelectionMode = 'values' | 'proportion';

export interface SelectOperationDraft {
  scope: SelectScope;
  mode: SelectMode;
  field: string;
  operator: SelectOperator;
  values: string[];
  minValue: string;
  maxValue: string;
  connectorToNext: SelectConnector;
  labelSelectionMode: LabelSelectionMode;
  labelProportion: string;
  labelRandomSeed: string;
}

export interface SelectFormState {
  outputName: string;
  draftStep: SelectOperationDraft;
  operations: SelectOperationDraft[];
  comments: string;
}

export interface SelectDatasetSchema {
  columnNames: string[];
  labelHeadings: string[];
  labelClassesByHeading: Record<string, DatasetLabelClass[]>;
  labelSource: string;
  columnValueTypes?: Record<string, VariableValueType>;
}
