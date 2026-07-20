import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import type { PartitionFormState } from '../../../features/partition/partition.types';

interface ReviewSummaryProps {
  datasets: DatasetRecord[];
  form: PartitionFormState;
}

export function ReviewSummary({ datasets, form }: ReviewSummaryProps) {
  return (
    <dl className="summary-list">
      <div className="summary-list__row">
        <dt>Operation</dt>
        <dd>Partition</dd>
      </div>
      <div className="summary-list__row">
        <dt>Input datasets</dt>
        <dd>{datasets.length}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Strategy</dt>
        <dd>{labelForStrategy(form.strategy)}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Split ratio</dt>
        <dd>
          {form.trainRatio} / {form.validationRatio} / {form.testRatio}
        </dd>
      </div>
      <div className="summary-list__row">
        <dt>Shuffle</dt>
        <dd>{form.shuffle ? 'Yes' : 'No'}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Random seed</dt>
        <dd>{form.randomSeed}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Comment summary</dt>
        <dd>{form.commentSummary || 'Not added yet'}</dd>
      </div>
    </dl>
  );
}

function labelForStrategy(strategy: PartitionFormState['strategy']) {
  switch (strategy) {
    case 'random_split':
      return 'Random split';
    case 'stratified_split':
      return 'Stratified split';
    case 'time_based_split':
      return 'Time-based split';
    default:
      return strategy;
  }
}
