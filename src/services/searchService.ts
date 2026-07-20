import type { DatasetRecord } from '../features/datasets/dataset.types';
import { mockDatasets } from '../mocks/datasets';

export async function loadDatasets(): Promise<DatasetRecord[]> {
  return Promise.resolve(mockDatasets);
}
