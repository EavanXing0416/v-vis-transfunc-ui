import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { GenImageTransformationRecord, DerivedDatasetDraft } from '../transformations/transformation.types';
import { GENIMAGE_VARIABLES, type GenImageFormState } from './genImage.types';

export function buildGenImagePayload(
  dataset: DatasetRecord,
  form: GenImageFormState,
  derivedDataset: DerivedDatasetDraft,
): GenImageTransformationRecord {
  return {
    transformation_id: createTransformationId(),
    operation: 'GenImage',
    status: 'ready',
    created_at: new Date().toISOString(),
    input_datasets: [
      {
        id: dataset.id,
        name: dataset.name,
        type: dataset.type,
        objectCount: dataset.objectCount,
        metadataSummary: dataset.metadataSummary,
        modality: dataset.modality,
        dataObjectType: dataset.dataObjectType,
      },
    ],
    gen_image: {
      changed_variables: form.changedVariables,
      fixed_variables: GENIMAGE_VARIABLES.filter((value) => !form.changedVariables.includes(value)),
      shape_values: form.shapeValues,
      number_of_images: form.numberOfImages,
      image_size: [form.imageWidth, form.imageHeight],
      output_format: form.outputFormat,
      output_folder: `${dataset.name}_output`,
      output_prefix: derivedDataset.name,
      sampling_rule: form.samplingRule,
      random_seed: form.randomSeed,
      file_naming_rule: `${derivedDataset.name}_{index}.${form.outputFormat}`,
      generation_config_id: dataset.name,
      color_type: 'grey',
      background: 'white',
      color_background: 10,
      shape_cropping: false,
      shape_overlapping: false,
      scale_levels: form.scale.levels,
      size_levels: form.size.levels,
      pos_x_levels: form.posX.levels,
      pos_y_levels: form.posY.levels,
      rotation_levels: form.rotation.levels,
      grey_levels: form.grey.levels,
      scale_range: [form.scale.min, form.scale.max],
      size_range: [form.size.min, form.size.max],
      pos_x_range: [form.posX.min, form.posX.max],
      pos_y_range: [form.posY.min, form.posY.max],
      rotation_range: [form.rotation.min, form.rotation.max],
      grey_range: [form.grey.min, form.grey.max],
    },
    comments: form.comments,
    derived_dataset_count: 1,
    derived_datasets: [derivedDataset],
  };
}
