import { ReadmePreviewButton } from '../../../components/datasets/ReadmePreviewButton';
import { buildDatasetReadmePreview } from '../../../features/datasets/buildDatasetReadmePreview';
import { getDatasetDataObjectType } from '../../../features/datasets/dataObjectType';
import type { DatasetRecord } from '../../../features/datasets/dataset.types';

interface InputDatasetSummaryProps {
  datasets: DatasetRecord[];
}

export function InputDatasetSummary({ datasets }: InputDatasetSummaryProps) {
  return (
    <div className="dataset-summary-table dataset-summary-table--aligned">
      <div className="dataset-summary-table__head">
        <span>Name</span>
        <span>Type</span>
        <span>Data Objects</span>
        <span>Data object type</span>
        <span>Metadata</span>
        <span aria-hidden="true" />
      </div>
      {datasets.map((dataset) => (
        <article className="dataset-summary-row dataset-summary-row--with-info" key={dataset.id}>
          <span className="dataset-summary-row__name">{dataset.name}</span>
          <span className="dataset-summary-row__type">{dataset.type}</span>
          <span>{dataset.objectCount}</span>
          <span>{getDatasetDataObjectType(dataset)}</span>
          <span>{dataset.metadataSummary}</span>
          <span className="dataset-summary-row__icon">
            <ReadmePreviewButton content={buildDatasetReadmePreview(dataset)} title={dataset.name} />
          </span>
        </article>
      ))}
    </div>
  );
}
