import type { DatasetRecord } from '../features/datasets/dataset.types';
import { getSelectColumnNames, getSelectColumnValueTypes, normalizeSelectMetadata } from '../features/datasets/selectMetadata';
import type { SelectDatasetSchema } from '../features/select/select.types';

export function getSelectSchema(dataset: DatasetRecord): SelectDatasetSchema {
  if (dataset.selectMetadata) {
    const metadata = normalizeSelectMetadata(dataset.selectMetadata);
    return {
      columnNames: getSelectColumnNames(metadata),
      labelHeadings: metadata.labelHeadings,
      labelClassesByHeading: metadata.labelClassesByHeading,
      labelSource: metadata.labelSource ?? 'NA',
      columnValueTypes: getSelectColumnValueTypes(metadata),
    };
  }

  return buildFallbackSchema(dataset);
}

function buildFallbackSchema(dataset: DatasetRecord): SelectDatasetSchema {
  const columnNames = Array.from({ length: Math.max(dataset.variableCount, 4) }, (_, index) => `column_${index + 1}`);
  const labelHeadings = Array.from({ length: Math.max(dataset.labelCount, 1) }, (_, index) => `label_heading_${index + 1}`);

  return {
    columnNames,
    labelHeadings,
    labelSource: 'NA',
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
    columnValueTypes: Object.fromEntries(columnNames.map((name) => [name, 'text'])),
  };
}
