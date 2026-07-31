import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import type { SimulatePDEFormState } from '../../../features/simulatepde/simulatePDE.types';
import type { DerivedDatasetDraft } from '../../../features/transformations/transformation.types';

interface SimulatePDEReviewProps {
  datasets: DatasetRecord[];
  form: SimulatePDEFormState;
  derivedDatasets: DerivedDatasetDraft[];
}

const COMMENT_PREVIEW_LIMIT = 120;

export function SimulatePDEReview({ datasets, form, derivedDatasets }: SimulatePDEReviewProps) {
  return (
    <dl className="summary-list">
      <div className="summary-list__row">
        <dt>Operation</dt>
        <dd>SimulatePDE</dd>
      </div>
      <div className="summary-list__row">
        <dt>Input datasets</dt>
        <dd>{datasets.length}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Derived datasets</dt>
        <dd>{derivedDatasets.length}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Solver</dt>
        <dd>{formatSolver(form.solverMethod)}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Boundary</dt>
        <dd>{form.boundaryCondition}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Spatial</dt>
        <dd>{form.spatialDimension.toUpperCase()}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Temporal</dt>
        <dd>{form.hasTemporalDimension ? 'True' : 'False'}</dd>
      </div>
      <div className="summary-list__row summary-list__row--wrap">
        <dt>Metadata</dt>
        <dd>{formatMetadataLine(form)}</dd>
      </div>
      <div className="summary-list__row summary-list__row--wrap">
        <dt>Comments</dt>
        <dd className="summary-list__value summary-list__value--wrap">{formatCommentPreview(form.comments)}</dd>
      </div>
    </dl>
  );
}

function formatSolver(value: SimulatePDEFormState['solverMethod']) {
  switch (value) {
    case 'fdm':
      return 'FDM';
    case 'fem':
      return 'FEM';
    default:
      return 'Spectral';
  }
}


function formatMetadataLine(form: SimulatePDEFormState) {
  const parts = [`x = (${form.xMin},${form.xMax}), xstep = ${form.xStep}`];

  if (form.spatialDimension === '2d') {
    parts.push(`y = (${form.yMin},${form.yMax}), ystep = ${form.yStep}`);
  }

  if (form.hasTemporalDimension) {
    parts.push(`t = (${form.tMin},${form.tMax}), tstep = ${form.tStep}`);
  }

  return parts.join(', ');
}

function formatCommentPreview(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Not added yet';
  }

  if (trimmed.length <= COMMENT_PREVIEW_LIMIT) {
    return trimmed;
  }

  return `${trimmed.slice(0, COMMENT_PREVIEW_LIMIT).trimEnd()}...`;
}
