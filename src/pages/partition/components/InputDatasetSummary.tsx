import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import { summarizeDatasetSelection } from '../../../features/datasets/datasetSummary';

interface InputDatasetSummaryProps {
  datasets: DatasetRecord[];
}

export function InputDatasetSummary({ datasets }: InputDatasetSummaryProps) {
  const summary = summarizeDatasetSelection(datasets);

  return (
    <div className="stack--tight">
      <div className="banner">
        <strong>{summary.total} input datasets selected</strong>
        <p className="muted" style={{ marginBottom: 0 }}>
          Selected in the search page and processed by this partition configuration.
        </p>
      </div>

      <div className="meta-row">
        <span className="meta-pill">Physical: {summary.physicalCount}</span>
        <span className="meta-pill">Virtual: {summary.virtualCount}</span>
        <span className="meta-pill">Sources: {summary.sources.join(', ')}</span>
      </div>

      <p className="partition-note">
        Preview: {summary.previewNames.join(', ')}
        {datasets.length > summary.previewNames.length ? ', ...' : ''}
      </p>
    </div>
  );
}
