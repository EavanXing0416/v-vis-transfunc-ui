import type { DatasetRecord } from '../../../features/datasets/dataset.types';

interface InputDatasetSummaryProps {
  datasets: DatasetRecord[];
}

export function InputDatasetSummary({ datasets }: InputDatasetSummaryProps) {
  return (
    <div className="dataset-summary-table dataset-summary-table--aligned">
      <div className="dataset-summary-table__head">
        <span>Name</span>
        <span>ID</span>
        <span>Type</span>
        <span>Data Objects</span>
        <span>Metadata</span>
      </div>
      {datasets.map((dataset) => (
        <article className="dataset-summary-row" key={dataset.id}>
          <span className="dataset-summary-row__name">{dataset.name}</span>
          <span>{dataset.id}</span>
          <span className="dataset-summary-row__type">{dataset.type}</span>
          <span>{dataset.objectCount}</span>
          <span>{dataset.metadataSummary}</span>
        </article>
      ))}
    </div>
  );
}
