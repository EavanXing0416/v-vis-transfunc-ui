import type { CSSProperties } from 'react';
import { ReadmePreviewButton } from '../datasets/ReadmePreviewButton';
import { buildDatasetReadmePreview } from '../../features/datasets/buildDatasetReadmePreview';
import { getDatasetDataObjectType } from '../../features/datasets/dataObjectType';
import type { DatasetRecord } from '../../features/datasets/dataset.types';

interface CompactDatasetTableProps {
  datasets: DatasetRecord[];
  selectable?: boolean;
  selectedIds?: string[];
  onToggle?: (datasetId: string) => void;
  onNameChange?: (datasetId: string, nextName: string) => void;
  onTypeChange?: (datasetId: string, nextType: DatasetRecord['type']) => void;
  compact?: boolean;
  maxHeightClassName?: string;
}

export function CompactDatasetTable({
  datasets,
  selectable = false,
  selectedIds = [],
  onToggle,
  onNameChange,
  onTypeChange,
  compact = false,
  maxHeightClassName,
}: CompactDatasetTableProps) {
  return (
    <div className={['dataset-table-wrap', maxHeightClassName].filter(Boolean).join(' ')}>
      <table style={{ borderCollapse: 'collapse', minWidth: '100%', width: '100%' }}>
        <colgroup>
          {selectable ? <col style={{ width: '56px' }} /> : null}
          <col style={{ width: '220px' }} />
          <col style={{ width: '102px' }} />
          <col style={{ width: '92px' }} />
          <col style={{ width: '144px' }} />
          <col />
          <col style={{ width: '52px' }} />
        </colgroup>
        <thead>
          <tr>
            {selectable ? <th style={compact ? compactHeaderCellStyle : headerCellStyle}>Select</th> : null}
            <th style={compact ? compactHeaderCellStyle : headerCellStyle}>Name</th>
            <th style={compact ? compactHeaderCellStyle : headerCellStyle}>Type</th>
            <th style={compact ? compactHeaderCellStyle : headerCellStyle}>Data Objects</th>
            <th style={compact ? compactHeaderCellStyle : headerCellStyle}>Data Object Type</th>
            <th style={compact ? compactHeaderCellStyle : headerCellStyle}>Metadata</th>
            <th style={compact ? compactHeaderCellStyle : headerCellStyle} aria-label="README" />
          </tr>
        </thead>
        <tbody>
          {datasets.map((dataset) => {
            const isSelected = selectedIds.includes(dataset.id);

            return (
              <tr key={dataset.id} style={{ background: isSelected ? 'rgba(15,108,129,0.08)' : 'transparent' }}>
                {selectable ? (
                  <td style={compact ? compactBodyCellStyle : bodyCellStyle}>
                    <input
                      aria-label={`Select ${dataset.name}`}
                      checked={isSelected}
                      onChange={() => onToggle?.(dataset.id)}
                      type="checkbox"
                    />
                  </td>
                ) : null}
                <td style={compact ? { ...compactBodyCellStyle, ...nameCellStyle } : { ...bodyCellStyle, ...nameCellStyle }}>
                  <input
                    aria-label={`Edit name for ${dataset.name}`}
                    onChange={(event) => onNameChange?.(dataset.id, event.target.value)}
                    style={compact ? compactNameInputStyle : nameInputStyle}
                    type="text"
                    value={dataset.name}
                  />
                </td>
                <td style={compact ? compactBodyCellStyle : bodyCellStyle}>
                  <select
                    aria-label={`Edit type for ${dataset.name}`}
                    onChange={(event) => onTypeChange?.(dataset.id, event.target.value as DatasetRecord['type'])}
                    style={compact ? compactTypeSelectStyle : typeSelectStyle}
                    value={dataset.type}
                  >
                    <option value="virtual">virtual</option>
                    <option value="physical">physical</option>
                  </select>
                </td>
                <td style={compact ? compactBodyCellStyle : bodyCellStyle}>{dataset.objectCount}</td>
                <td style={compact ? compactBodyCellStyle : bodyCellStyle}>{getDatasetDataObjectType(dataset)}</td>
                <td style={compact ? { ...compactBodyCellStyle, ...metadataCellStyle } : { ...bodyCellStyle, ...metadataCellStyle }}><span style={metadataPreviewStyle}>{dataset.metadataSummary}</span></td>
                <td style={compact ? compactBodyCellStyle : bodyCellStyle}>
                  <ReadmePreviewButton content={buildDatasetReadmePreview(dataset)} title={dataset.name} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const headerCellStyle: CSSProperties = {
  borderBottom: '1px solid var(--line)',
  color: 'var(--muted)',
  fontSize: '0.82rem',
  fontWeight: 700,
  padding: '11px 10px',
  textAlign: 'left',
  textTransform: 'uppercase',
};

const bodyCellStyle: CSSProperties = {
  borderBottom: '1px solid rgba(201, 216, 228, 0.55)',
  padding: '11px 10px',
  verticalAlign: 'middle',
};

const compactHeaderCellStyle: CSSProperties = {
  ...headerCellStyle,
  fontSize: '0.76rem',
  padding: '8px 8px',
};

const compactBodyCellStyle: CSSProperties = {
  ...bodyCellStyle,
  fontSize: '0.88rem',
  lineHeight: 1.35,
  padding: '8px 8px',
};

const nameCellStyle: CSSProperties = {
  minWidth: '180px',
};

const metadataCellStyle: CSSProperties = {
  overflow: 'hidden',
};

const metadataPreviewStyle: CSSProperties = {
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  display: '-webkit-box',
  lineHeight: 1.35,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
};

const nameInputStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.96)',
  border: '1px solid var(--line)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--ink)',
  fontSize: '0.92rem',
  minHeight: '30px',
  padding: '5px 8px',
  width: '100%',
};

const compactNameInputStyle: CSSProperties = {
  ...nameInputStyle,
  fontSize: '0.86rem',
  minHeight: '28px',
  padding: '4px 8px',
};

const typeSelectStyle: CSSProperties = {
  ...nameInputStyle,
  textTransform: 'lowercase',
};

const compactTypeSelectStyle: CSSProperties = {
  ...compactNameInputStyle,
  textTransform: 'lowercase',
};
