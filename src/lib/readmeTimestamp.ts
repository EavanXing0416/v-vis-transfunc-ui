export function formatReadmeTimestamp(value: string | Date = new Date()) {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  }).format(date).replace(',', '');
}
