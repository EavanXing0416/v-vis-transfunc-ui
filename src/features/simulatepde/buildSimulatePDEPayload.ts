import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { DerivedDatasetDraft, SimulatePDETransformationRecord } from '../transformations/transformation.types';
import type { SimulatePDEFormState } from './simulatePDE.types';

export function buildSimulatePDEPayload(
  datasets: DatasetRecord[],
  form: SimulatePDEFormState,
  derivedDatasets: DerivedDatasetDraft[],
): SimulatePDETransformationRecord {
  return {
    transformation_id: createTransformationId(),
    operation: 'SimulatePDE',
    status: 'ready',
    created_at: new Date().toISOString(),
    input_datasets: datasets.map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      type: dataset.type,
      objectCount: dataset.objectCount,
      metadataSummary: dataset.metadataSummary,
      modality: dataset.modality,
      dataObjectType: dataset.dataObjectType,
    })),
    simulate_pde: {
      solver_method: form.solverMethod,
      equation_type: form.equationType,
      spatial_dimension: form.spatialDimension,
      has_temporal_dimension: form.hasTemporalDimension,
      boundary_condition: form.boundaryCondition,
      x_range: [form.xMin, form.xMax],
      x_step: form.xStep,
      y_range: form.spatialDimension === '2d' ? [form.yMin, form.yMax] : null,
      y_step: form.spatialDimension === '2d' ? form.yStep : null,
      t_range: form.hasTemporalDimension ? [form.tMin, form.tMax] : null,
      t_step: form.hasTemporalDimension ? form.tStep : null,
    },
    comments: form.comments,
    derived_dataset_count: derivedDatasets.length,
    derived_datasets: derivedDatasets,
  };
}
