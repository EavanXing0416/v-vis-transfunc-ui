import { getDatasetDataObjectType } from './dataObjectType';
import type { DatasetRecord } from './dataset.types';

export function buildDatasetReadmePreview(dataset: DatasetRecord) {
  if (dataset.readmeContent?.trim()) {
    return dataset.readmeContent;
  }

  const lines = [
    `# ${dataset.name} README`,
    '',
    '## Metadata',
    `- Dataset name: ${dataset.name}`,
    `- Type: ${capitalize(dataset.type)}`,
    `- Data object type: ${getDatasetDataObjectType(dataset)}`,
    `- No. of data objects: ${dataset.objectCount}`,
    `- Metadata: ${dataset.metadataSummary}`,
  ];

  return lines.join('\n');
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
