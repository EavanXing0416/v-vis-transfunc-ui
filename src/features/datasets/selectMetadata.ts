import { getDatasetDataObjectType } from './dataObjectType';
import type { DatasetLabelClass, DatasetRecord, DatasetSelectMetadata, SelectValueType } from './dataset.types';

type SelectMetadataInput = Pick<DatasetRecord, 'dataObjectType' | 'modality' | 'selectMetadata'> | null | undefined;

interface SelectOperationLike {
  scope: 'across' | 'within';
  mode: 'labels' | 'variables';
  field: string;
  operator: 'equals' | 'notEquals' | 'in' | 'gt' | 'lt' | 'between';
  values: string[];
}

export function normalizeSelectMetadata(metadata?: DatasetSelectMetadata | null): DatasetSelectMetadata {
  const labelHeadings = uniqueStrings(metadata?.labelHeadings ?? []);
  const labelClassesByHeading = Object.fromEntries(
    labelHeadings.map((heading) => [heading, normalizeLabelClasses(metadata?.labelClassesByHeading?.[heading] ?? [])]),
  );
  const columnNames = uniqueStrings(metadata?.columnNames ?? []);
  const columnValueTypes = { ...(metadata?.columnValueTypes ?? {}) };

  return {
    labelHeadings,
    labelClassesByHeading,
    labelSource: metadata?.labelSource?.trim() || 'NA',
    columnNames,
    columnValueTypes,
  };
}

export function getSelectColumnNames(metadata?: DatasetSelectMetadata | null): string[] {
  return normalizeSelectMetadata(metadata).columnNames ?? [];
}

export function getSelectColumnValueTypes(metadata?: DatasetSelectMetadata | null): Record<string, SelectValueType> {
  return normalizeSelectMetadata(metadata).columnValueTypes ?? {};
}

export function appendSelectMetadataBlock(content: string, metadata?: DatasetSelectMetadata | null) {
  const trimmed = content.trimEnd();

  if (trimmed.includes('## Select metadata')) {
    return trimmed.endsWith('\n') ? trimmed : `${trimmed}\n`;
  }

  const block = buildSelectMetadataBlock(metadata).join('\n');
  const marker = '\n## User comments';
  const index = trimmed.indexOf(marker);

  if (index >= 0) {
    return `${trimmed.slice(0, index).trimEnd()}\n\n${block}\n${trimmed.slice(index + 1)}`;
  }

  return `${trimmed}\n\n${block}\n`;
}

export function buildSelectMetadataBlock(metadata?: DatasetSelectMetadata | null) {
  const normalized = normalizeSelectMetadata(metadata);

  return [
    '## Select metadata',
    `- Label headings: ${formatArray(normalized.labelHeadings)}`,
    `- Label source: ${normalized.labelSource || 'NA'}`,
    `- Label values by heading: ${formatLabelClassesByHeading(normalized.labelClassesByHeading)}`,
    `- Column names: ${formatArray(normalized.columnNames ?? [])}`,
    `- Column value types: ${formatObject(normalized.columnValueTypes ?? {})}`,
  ];
}

export function parseSelectMetadataBlock(content: string): DatasetSelectMetadata | undefined {
  const labelHeadings = parseStringArray(extractField(content, 'Label headings'));
  const labelSource = extractField(content, 'Label source') || 'NA';
  const labelClassesByHeading = parseLabelClassesByHeading(extractField(content, 'Label values by heading'));
  const columnNames = parseStringArray(extractField(content, 'Column names'));
  const columnValueTypes = parseValueTypeMap(extractField(content, 'Column value types'));

  if (
    !labelHeadings.length
    && !columnNames.length
    && !Object.keys(labelClassesByHeading).length
    && !Object.keys(columnValueTypes).length
    && labelSource === 'NA'
  ) {
    return undefined;
  }

  return normalizeSelectMetadata({
    labelHeadings,
    labelClassesByHeading,
    labelSource,
    columnNames,
    columnValueTypes,
  });
}

export function buildMergedSelectMetadata(
  inputs: Array<(SelectMetadataInput & { id?: string; name?: string })>,
  schemaHandling: 'union_all_columns' | 'intersect_common_columns' | 'reference_dataset_with_na_fill' | null,
  referenceDatasetId: string | null,
): DatasetSelectMetadata {
  const metas = inputs.map((input) => normalizeSelectMetadata(input?.selectMetadata));
  const labelHeadings = uniqueStrings(metas.flatMap((meta) => meta.labelHeadings));
  const labelClassesByHeading = Object.fromEntries(
    labelHeadings.map((heading) => [heading, mergeLabelClasses(metas.map((meta) => meta.labelClassesByHeading[heading] ?? []))]),
  );

  const isTabular = inputs.every((input) => {
    if (!input) {
      return false;
    }

    return (input.dataObjectType ?? input.modality ?? '').trim().toLowerCase() === 'tabular';
  });

  let columnNames: string[] = [];
  let columnValueTypes: Record<string, SelectValueType> = {};

  if (isTabular && metas.length > 0) {
    if (schemaHandling === 'intersect_common_columns') {
      columnNames = metas.reduce<string[]>((accumulator, meta, index) => (
        index === 0 ? [...(meta.columnNames ?? [])] : accumulator.filter((name) => (meta.columnNames ?? []).includes(name))
      ), []);
    } else if (schemaHandling === 'reference_dataset_with_na_fill' && referenceDatasetId) {
      const referenceMeta = normalizeSelectMetadata(inputs.find((input) => input?.id === referenceDatasetId)?.selectMetadata);
      columnNames = [...(referenceMeta.columnNames ?? [])];
      columnValueTypes = { ...referenceMeta.columnValueTypes };
    } else {
      columnNames = uniqueStrings(metas.flatMap((meta) => meta.columnNames ?? []));
    }

    if (!Object.keys(columnValueTypes).length) {
      for (const meta of metas) {
        Object.assign(columnValueTypes, meta.columnValueTypes ?? {});
      }
    }

    if (columnNames.length) {
      columnValueTypes = Object.fromEntries(columnNames.map((name) => [name, columnValueTypes[name] ?? 'text']));
    }
  }

  return normalizeSelectMetadata({
    labelHeadings,
    labelClassesByHeading,
    labelSource: labelHeadings.length ? 'inherited from merged inputs' : 'NA',
    columnNames,
    columnValueTypes,
  });
}

export function buildAddLabelSelectMetadata(
  primary: SelectMetadataInput,
  selectedLabelHeadings: string[],
): DatasetSelectMetadata {
  const base = normalizeSelectMetadata(primary?.selectMetadata);
  const labelHeadings = uniqueStrings([...base.labelHeadings, ...selectedLabelHeadings.filter(Boolean)]);
  const labelClassesByHeading = { ...base.labelClassesByHeading };

  for (const heading of selectedLabelHeadings) {
    if (heading && !labelClassesByHeading[heading]) {
      labelClassesByHeading[heading] = [];
    }
  }

  return normalizeSelectMetadata({
    ...base,
    labelHeadings,
    labelClassesByHeading,
    labelSource: selectedLabelHeadings.length ? 'updated by AddLabel' : (base.labelSource || 'NA'),
  });
}

export function buildSelectOutputSelectMetadata(
  input: SelectMetadataInput,
  operations: SelectOperationLike[],
): DatasetSelectMetadata {
  const base = normalizeSelectMetadata(input?.selectMetadata);
  let columnNames = [...(base.columnNames ?? [])];

  for (const operation of operations) {
    if (operation.mode !== 'variables' || operation.scope !== 'within') {
      continue;
    }

    if (operation.operator === 'in') {
      columnNames = columnNames.filter((name) => operation.values.includes(name));
    }

    if (operation.operator === 'notEquals') {
      columnNames = columnNames.filter((name) => !operation.values.includes(name));
    }
  }

  return normalizeSelectMetadata({
    ...base,
    columnNames,
  });
}

export function buildGenImageSelectMetadata(labelHeadings: string[]): DatasetSelectMetadata {
  return normalizeSelectMetadata({
    labelHeadings,
    labelClassesByHeading: Object.fromEntries(labelHeadings.map((heading) => [heading, []])),
    labelSource: labelHeadings.length ? 'parameter rows' : 'NA',
    columnNames: [],
    columnValueTypes: {},
  });
}

function extractField(content: string, label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = content.match(new RegExp(`^- ${escaped}:[\t ]*([^\r\n]*)$`, 'm'));
  return (match?.[1] ?? '').trim();
}

function parseStringArray(value: string) {
  const trimmed = value.trim();

  if (!trimmed || trimmed === 'NA') {
    return [];
  }

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed)
        ? parsed.map(String).map((item) => item.trim()).filter(Boolean)
        : [];
    } catch {
      return [];
    }
  }

  return trimmed
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item && item !== '...');
}

function parseLabelClassesByHeading(value: string): Record<string, DatasetLabelClass[]> {
  const trimmed = value.trim();

  if (!trimmed || trimmed === 'NA' || !trimmed.startsWith('{')) {
    return {};
  }

  try {
    const parsed = JSON.parse(trimmed) as Record<string, Array<string | DatasetLabelClass>>;
    return Object.fromEntries(
      Object.entries(parsed).map(([heading, items]) => [
        heading,
        (Array.isArray(items) ? items : []).map((item) => (
          typeof item === 'string'
            ? { name: item, count: 0 }
            : { name: String(item.name), count: Number(item.count) || 0 }
        )),
      ]),
    );
  } catch {
    return {};
  }
}

function parseValueTypeMap(value: string): Record<string, SelectValueType> {
  const trimmed = value.trim();

  if (!trimmed || trimmed === 'NA' || !trimmed.startsWith('{')) {
    return {};
  }

  try {
    const parsed = JSON.parse(trimmed) as Record<string, SelectValueType>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

function normalizeLabelClasses(items: DatasetLabelClass[]) {
  return items
    .map((item) => ({ name: String(item.name).trim(), count: Number(item.count) || 0 }))
    .filter((item) => item.name);
}

function mergeLabelClasses(groups: DatasetLabelClass[][]) {
  const counts = new Map<string, number>();

  for (const group of groups) {
    for (const item of normalizeLabelClasses(group)) {
      counts.set(item.name, (counts.get(item.name) ?? 0) + item.count);
    }
  }

  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
}

function uniqueStrings(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function formatArray(items: string[]) {
  return items.length ? JSON.stringify(items) : 'NA';
}

function formatObject(value: Record<string, unknown>) {
  return Object.keys(value).length ? JSON.stringify(value) : 'NA';
}

function formatLabelClassesByHeading(value: Record<string, DatasetLabelClass[]>) {
  const normalized = Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key.trim())
      .map(([key, items]) => [key, normalizeLabelClasses(items)]),
  );

  return Object.keys(normalized).length ? JSON.stringify(normalized) : 'NA';
}
