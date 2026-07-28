import type { DatasetRecord } from '../features/datasets/dataset.types';
import type { SelectDatasetSchema } from '../features/select/select.types';

export function getSelectSchema(dataset: DatasetRecord): SelectDatasetSchema {
  if (dataset.selectMetadata) {
    return dataset.selectMetadata;
  }

  return buildFallbackSchema(dataset);
}

function buildFallbackSchema(dataset: DatasetRecord): SelectDatasetSchema {
  const variableHeadings = Array.from({ length: Math.max(dataset.variableCount, 4) }, (_, index) => `variable_${index + 1}`);
  const labelHeadings = Array.from({ length: Math.max(dataset.labelCount, 1) }, (_, index) => `label_heading_${index + 1}`);

  return {
    variableHeadings,
    labelHeadings,
    labelClassesByHeading: Object.fromEntries(
      labelHeadings.map((heading) => [
        heading,
        [
          { name: `${heading}_class_1`, count: Math.floor(dataset.objectCount * 0.5) },
          { name: `${heading}_class_2`, count: Math.floor(dataset.objectCount * 0.3) },
          { name: `${heading}_class_3`, count: dataset.objectCount - Math.floor(dataset.objectCount * 0.5) - Math.floor(dataset.objectCount * 0.3) },
        ],
      ]),
    ),
  };
}
