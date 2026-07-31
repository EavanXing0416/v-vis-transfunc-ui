import type { DatasetRecord } from '../features/datasets/dataset.types';
import { readmeBackedDatasets } from '../mocks/readmeDatasets';

export async function loadDatasets(): Promise<DatasetRecord[]> {
  return Promise.resolve(readmeBackedDatasets);
}
