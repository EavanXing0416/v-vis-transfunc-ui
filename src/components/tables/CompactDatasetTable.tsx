import type { DatasetRecord } from '../../features/datasets/dataset.types';

interface CompactDatasetTableProps {
  datasets: DatasetRecord[];
  selectable?: boolean;
  selectedIds?: string[];
  onToggle?: (datasetId: string) => void;
}

export function CompactDatasetTable({
  datasets,
  selectable = false,
  selectedIds = [],
  onToggle,
}: CompactDatasetTableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', minWidth: '100%', width: '100%' }}>
        <thead>
          <tr>
            {selectable ? <th style={headerCellStyle}>Select</th> : null}
            <th style={headerCellStyle}>Dataset ID</th>
            <th style={headerCellStyle}>Name</th>
            <th style={headerCellStyle}>Type</th>
            <th style={headerCellStyle}>Source</th>
            <th style={headerCellStyle}>Metadata</th>
          </tr>
        </thead>
        <tbody>
          {datasets.map((dataset) => {
            const isSelected = selectedIds.includes(dataset.id);

            return (
              <tr key={dataset.id} style={{ background: isSelected ? 'rgba(15,108,129,0.08)' : 'transparent' }}>
                {selectable ? (
                  <td style={bodyCellStyle}>
                    <input
                      aria-label={`Select ${dataset.name}`}
                      checked={isSelected}
                      onChange={() => onToggle?.(dataset.id)}
                      type="checkbox"
                    />
                  </td>
                ) : null}
                <td style={bodyCellStyle}>{dataset.id}</td>
                <td style={bodyCellStyle}>{dataset.name}</td>
                <td style={bodyCellStyle}>{dataset.type}</td>
                <td style={bodyCellStyle}>{dataset.source}</td>
                <td style={bodyCellStyle}>{dataset.metadataSummary}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const headerCellStyle: React.CSSProperties = {
  borderBottom: '1px solid var(--line)',
  color: 'var(--muted)',
  fontSize: '0.83rem',
  fontWeight: 700,
  padding: '12px 10px',
  textAlign: 'left',
  textTransform: 'uppercase',
};

const bodyCellStyle: React.CSSProperties = {
  borderBottom: '1px solid rgba(201, 216, 228, 0.55)',
  padding: '12px 10px',
  verticalAlign: 'top',
};
