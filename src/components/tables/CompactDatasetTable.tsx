import type { CSSProperties } from 'react';
import type { DatasetRecord } from '../../features/datasets/dataset.types';

interface CompactDatasetTableProps {
  datasets: DatasetRecord[];
  selectable?: boolean;
  selectedIds?: string[];
  onToggle?: (datasetId: string) => void;
  compact?: boolean;
  maxHeightClassName?: string;
}

export function CompactDatasetTable({
  datasets,
  selectable = false,
  selectedIds = [],
  onToggle,
  compact = false,
  maxHeightClassName,
}: CompactDatasetTableProps) {
  return (
    <div className={[ 'dataset-table-wrap', maxHeightClassName ].filter(Boolean).join(' ')}>
      <table style={{ borderCollapse: 'collapse', minWidth: '100%', width: '100%' }}>
        <thead>
          <tr>
            {selectable ? <th style={compact ? compactHeaderCellStyle : headerCellStyle}>Select</th> : null}
            <th style={compact ? compactHeaderCellStyle : headerCellStyle}>Dataset ID</th>
            <th style={compact ? compactHeaderCellStyle : headerCellStyle}>Name</th>
            <th style={compact ? compactHeaderCellStyle : headerCellStyle}>Type</th>
            <th style={compact ? compactHeaderCellStyle : headerCellStyle}>Source</th>
            <th style={compact ? compactHeaderCellStyle : headerCellStyle}>Metadata</th>
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
                <td style={compact ? compactBodyCellStyle : bodyCellStyle}>{dataset.id}</td>
                <td style={compact ? compactBodyCellStyle : bodyCellStyle}>{dataset.name}</td>
                <td style={compact ? compactBodyCellStyle : bodyCellStyle}>{dataset.type}</td>
                <td style={compact ? compactBodyCellStyle : bodyCellStyle}>{dataset.source}</td>
                <td style={compact ? compactBodyCellStyle : bodyCellStyle}>{dataset.metadataSummary}</td>
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
  verticalAlign: 'top',
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
