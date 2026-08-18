import { getDatasetDataObjectType } from './dataObjectType';
import type { DatasetRecord } from './dataset.types';
import { appendSelectMetadataBlock } from './selectMetadata';
import { formatReadmeTimestamp } from '../../lib/readmeTimestamp';
import { formatObjectCountDisplay } from '../../lib/objectCount';

export function buildDatasetReadmePreview(dataset: DatasetRecord) {
  if (dataset.readmeContent?.trim()) {
    return appendSelectMetadataBlock(dataset.readmeContent, dataset.selectMetadata);
  }

  const lines = [
    `# ${dataset.name} README`,
    '',
    '## Metadata',
    `- Dataset name: ${dataset.name}`,
    `- Timestamp: ${formatReadmeTimestamp()}`,
    `- Type: ${capitalize(dataset.type)}`,
    `- Data object type: ${getDatasetDataObjectType(dataset)}`,
    `- No. of data objects: ${formatObjectCountDisplay(dataset.objectCount)}`,
    `- Metadata: ${dataset.metadataSummary}`,
  ];

  return appendSelectMetadataBlock(lines.join('\n'), dataset.selectMetadata);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
