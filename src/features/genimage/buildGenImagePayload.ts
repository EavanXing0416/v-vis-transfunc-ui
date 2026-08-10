import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { GenImageTransformationRecord, DerivedDatasetDraft } from '../transformations/transformation.types';
import { GENIMAGE_VARIABLES, type GenImageFormState } from './genImage.types';

export function buildGenImagePayload(
  dataset: DatasetRecord,
  form: GenImageFormState,
  derivedDataset: DerivedDatasetDraft,
): GenImageTransformationRecord {
  const changedVariables = GENIMAGE_VARIABLES.filter((value) => form.variableModes[value] === 'changed');
  const fixedVariables = GENIMAGE_VARIABLES.filter((value) => form.variableModes[value] === 'fixed');

  return {
    transformation_id: createTransformationId(),
    operation: 'GenImage',
    status: 'ready',
    created_at: new Date().toISOString(),
    input_datasets: [{
      id: dataset.id,
      name: dataset.name,
      type: dataset.type,
      objectCount: dataset.objectCount,
      metadataSummary: dataset.metadataSummary,
      modality: dataset.modality,
      dataObjectType: dataset.dataObjectType,
    }],
    gen_image: {
      changed_variables: changedVariables,
      fixed_variables: fixedVariables,
      shape_values: form.variableModes.shape === 'changed' ? form.changedShapeValues : [form.fixedShapeValue],
      fixed_shape_value: form.fixedShapeValue,
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
      scale_range: [form.variableModes.scale === 'changed' ? form.scale.min : form.scale.fixedValue, form.variableModes.scale === 'changed' ? form.scale.max : form.scale.fixedValue],
      size_range: [form.variableModes.size === 'changed' ? form.size.min : form.size.fixedValue, form.variableModes.size === 'changed' ? form.size.max : form.size.fixedValue],
      pos_x_range: [form.variableModes.pos_x === 'changed' ? form.posX.min : form.posX.fixedValue, form.variableModes.pos_x === 'changed' ? form.posX.max : form.posX.fixedValue],
      pos_y_range: [form.variableModes.pos_y === 'changed' ? form.posY.min : form.posY.fixedValue, form.variableModes.pos_y === 'changed' ? form.posY.max : form.posY.fixedValue],
      rotation_range: [form.variableModes.rotation === 'changed' ? form.rotation.min : form.rotation.fixedValue, form.variableModes.rotation === 'changed' ? form.rotation.max : form.rotation.fixedValue],
      grey_range: [form.variableModes.grey === 'changed' ? form.grey.min : form.grey.fixedValue, form.variableModes.grey === 'changed' ? form.grey.max : form.grey.fixedValue],
      scale_fixed_value: form.scale.fixedValue,
      size_fixed_value: form.size.fixedValue,
      pos_x_fixed_value: form.posX.fixedValue,
      pos_y_fixed_value: form.posY.fixedValue,
      rotation_fixed_value: form.rotation.fixedValue,
      grey_fixed_value: form.grey.fixedValue,
    },
    comments: form.comments,
    derived_dataset_count: 1,
    derived_datasets: [derivedDataset],
  };
}
