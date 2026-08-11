import type { DatasetRecord } from '../datasets/dataset.types';
import { getHomogeneousMergeDataObjectType, isTabularMerge } from './mergeMetadata';
import type { MergeFormState } from './merge.types';

export function getMergeValidationMessage(datasets: DatasetRecord[], form: MergeFormState) {
  if (!datasets.length) {
    return 'Select at least 1 input dataset.';
  }

  if (form.mergeMethod === 'data_objects') {
    if (datasets.length < 2) {
      return 'Data-object merge requires at least 2 input datasets.';
    }

    if (!getHomogeneousMergeDataObjectType(datasets)) {
      return 'Input datasets must share the same data object type before merging.';
    }

    if (form.mode === 'reshuffle' && !Number.isInteger(form.randomSeed)) {
      return 'Random seed must be an integer.';
    }

    if (isTabularMerge(datasets) && form.schemaHandling === 'reference_dataset_with_na_fill' && !form.schemaReferenceDatasetId) {
      return 'Select one reference dataset for schema handling.';
    }

    return null;
  }

  const primaryDataset = datasets.find((dataset) => dataset.id === form.primaryDatasetId);
  if (!primaryDataset) {
    return 'Select one primary dataset for AddLabel.';
  }

  const selectedSourceCount = Number(form.duplicatePrimaryDataset) + form.labelDatasetIds.length;
  if (!selectedSourceCount) {
    return 'Select at least 1 label source.';
  }

  if (form.duplicatePrimaryDataset && !form.labelHeadingsBySource.duplicate_primary?.trim()) {
    return 'Label heading is required for duplicate primary dataset.';
  }

  for (const datasetId of form.labelDatasetIds) {
    if (!form.labelHeadingsBySource[datasetId]?.trim()) {
      return 'Each selected label dataset needs its own label heading.';
    }
  }

  return null;
}
