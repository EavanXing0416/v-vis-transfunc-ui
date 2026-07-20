import type { DatasetRecord } from './dataset.types';

export function summarizeDatasetSelection(datasets: DatasetRecord[]) {
  const physicalCount = datasets.filter((dataset) => dataset.type === 'physical').length;
  const virtualCount = datasets.length - physicalCount;
  const sources = Array.from(new Set(datasets.map((dataset) => dataset.source)));
  const previewNames = datasets.slice(0, 5).map((dataset) => dataset.name);

  return {
    total: datasets.length,
    physicalCount,
    virtualCount,
    sources,
    previewNames,
  };
}
