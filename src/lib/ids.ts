export function createTransformationId() {
  const timePart = Date.now().toString().slice(-8);
  const randPart = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');

  return `TF${timePart}${randPart}`;
}
