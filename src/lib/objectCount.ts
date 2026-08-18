export function formatObjectCountDisplay(value: number | null | undefined) {
  return Number.isFinite(value) ? String(value) : 'n.a.';
}
