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
      {form.strategy === 'stratified_split' ? (
        <div className="summary-list__row">
          <dt>Stratify by</dt>
          <dd>{form.stratifyBy}</dd>
        </div>
      ) : null}
      {form.strategy === 'time_based_split' ? (
        <>
          <div className="summary-list__row">
            <dt>Time field</dt>
            <dd>{form.timeField}</dd>
          </div>
          <div className="summary-list__row">
            <dt>Temporal order</dt>
            <dd>{form.keepTemporalOrder ? 'Preserved' : 'Can be relaxed'}</dd>
          </div>
        </>
      ) : null}
      <div className="summary-list__row">
        <dt>Random seed</dt>
        <dd>{form.randomSeed}</dd>
      </div>
      <div className="summary-list__row summary-list__row--wrap">
        <dt>Comment summary</dt>
        <dd className="summary-list__value summary-list__value--wrap">{form.commentSummary || 'Not added yet'}</dd>
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
