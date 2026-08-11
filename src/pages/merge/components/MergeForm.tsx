import type { ChangeEvent } from 'react';
import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import { isTabularMerge } from '../../../features/merge/mergeMetadata';
import type { MergeFormState } from '../../../features/merge/merge.types';

interface MergeFormProps {
  datasets: DatasetRecord[];
  form: MergeFormState;
  onChange: (nextForm: MergeFormState) => void;
  validationMessage: string | null;
}

export function MergeForm({ datasets, form, onChange, validationMessage }: MergeFormProps) {
  function update<K extends keyof MergeFormState>(key: K, value: MergeFormState[K]) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  function handleMethodChange(event: ChangeEvent<HTMLSelectElement>) {
    update('mergeMethod', event.target.value as MergeFormState['mergeMethod']);
  }

  function handleSeedChange(event: ChangeEvent<HTMLInputElement>) {
    update('randomSeed', Number(event.target.value));
  }

  function handlePrimaryDatasetChange(event: ChangeEvent<HTMLSelectElement>) {
    const primaryDatasetId = event.target.value;
    onChange({
      ...form,
      primaryDatasetId,
      labelDatasetIds: form.labelDatasetIds.filter((datasetId) => datasetId !== primaryDatasetId),
    });
  }

  function handleDuplicatePrimaryToggle() {
    onChange({
      ...form,
      duplicatePrimaryDataset: !form.duplicatePrimaryDataset,
    });
  }

  function handleLabelDatasetToggle(datasetId: string) {
    const nextIds = form.labelDatasetIds.includes(datasetId)
      ? form.labelDatasetIds.filter((item) => item !== datasetId)
      : [...form.labelDatasetIds, datasetId];

    onChange({
      ...form,
      labelDatasetIds: nextIds,
    });
  }

  function handleSourceHeadingChange(sourceKey: string, value: string) {
    onChange({
      ...form,
      labelHeadingsBySource: {
        ...form.labelHeadingsBySource,
        [sourceKey]: value,
      },
    });
  }

  const labelCandidates = datasets.filter((dataset) => dataset.id !== form.primaryDatasetId);
  const showTabularSchema = form.mergeMethod === 'data_objects' && isTabularMerge(datasets);

  return (
    <div className="partition-split-layout">
      <div className="merge-complex-grid">
        <div className="field field--inline">
          <label htmlFor="merge-method">Operation</label>
          <select id="merge-method" onChange={handleMethodChange} value={form.mergeMethod}>
            <option value="data_objects">Merge selected data objects</option>
            <option value="complex">Add labels from selected datasets</option>
          </select>
        </div>

        {form.mergeMethod === 'data_objects' ? (
          <div className="field field--inline">
            <label htmlFor="merge-mode">Order mode</label>
            <select id="merge-mode" onChange={(event) => update('mode', event.target.value as MergeFormState['mode'])} value={form.mode}>
              <option value="attach">Attach</option>
              <option value="reshuffle">Reshuffle</option>
            </select>
          </div>
        ) : (
          <div className="field field--inline">
            <label htmlFor="primary-dataset">Primary dataset</label>
            <select id="primary-dataset" onChange={handlePrimaryDatasetChange} value={form.primaryDatasetId}>
              {datasets.map((dataset) => (
                <option key={dataset.id} value={dataset.id}>{dataset.name}</option>
              ))}
            </select>
          </div>
        )}

        {form.mergeMethod === 'data_objects' ? (
          form.mode === 'reshuffle' ? (
            <div className="field field--inline">
              <label htmlFor="merge-seed">Random seed</label>
              <input id="merge-seed" onChange={handleSeedChange} step="1" type="number" value={form.randomSeed} />
            </div>
          ) : <div />
        ) : (
          <div className="field field--inline">
            <label htmlFor="association-rule">Association rule</label>
            <select id="association-rule" onChange={() => undefined} value={form.associationRule}>
              <option value="align_by_record_order">Align by record order</option>
            </select>
          </div>
        )}
      </div>

      {showTabularSchema ? (
        <div className="merge-complex-grid">
          <div className="field field--inline">
            <label htmlFor="merge-schema-handling">Schema handling</label>
            <select
              id="merge-schema-handling"
              onChange={(event) => update('schemaHandling', event.target.value as MergeFormState['schemaHandling'])}
              value={form.schemaHandling}
            >
              <option value="union_all_columns">Keep all columns</option>
              <option value="intersect_common_columns">Keep common columns</option>
              <option value="reference_dataset_with_na_fill">Reference schema + NA fill</option>
            </select>
          </div>

          {form.schemaHandling === 'reference_dataset_with_na_fill' ? (
            <div className="field field--inline">
              <label htmlFor="merge-schema-reference">Reference dataset</label>
              <select
                id="merge-schema-reference"
                onChange={(event) => update('schemaReferenceDatasetId', event.target.value)}
                value={form.schemaReferenceDatasetId}
              >
                {datasets.map((dataset) => (
                  <option key={dataset.id} value={dataset.id}>{dataset.name}</option>
                ))}
              </select>
            </div>
          ) : <div />}
        </div>
      ) : null}

      {form.mergeMethod === 'complex' ? (
        <div className="field">
          <label>Label sources</label>
          <div className="merge-label-source-grid">
            <div className="merge-label-source-row">
              <label className="checkbox-card merge-label-source-card">
                <input checked={form.duplicatePrimaryDataset} onChange={handleDuplicatePrimaryToggle} type="checkbox" />
                <span>Duplicate primary dataset</span>
              </label>
              {form.duplicatePrimaryDataset ? (
                <input
                  className="dataset-summary-row__input"
                  onChange={(event) => handleSourceHeadingChange('duplicate_primary', event.target.value)}
                  placeholder="Label heading"
                  type="text"
                  value={form.labelHeadingsBySource.duplicate_primary ?? ''}
                />
              ) : (
                <div />
              )}
            </div>
            {labelCandidates.map((dataset) => {
              const checked = form.labelDatasetIds.includes(dataset.id);
              return (
                <div className="merge-label-source-row" key={dataset.id}>
                  <label className="checkbox-card merge-label-source-card">
                    <input checked={checked} onChange={() => handleLabelDatasetToggle(dataset.id)} type="checkbox" />
                    <span>{dataset.name}</span>
                  </label>
                  {checked ? (
                    <input
                      className="dataset-summary-row__input"
                      onChange={(event) => handleSourceHeadingChange(dataset.id, event.target.value)}
                      placeholder="Label heading"
                      type="text"
                      value={form.labelHeadingsBySource[dataset.id] ?? ''}
                    />
                  ) : (
                    <div />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
