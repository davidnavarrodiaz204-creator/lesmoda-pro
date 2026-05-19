export function normalizeWaNumber(input) {
  if (!input) return '';
  const digits = input.replace(/\D/g, '');
  if (digits.length === 9) return `51${digits}`;
  if (digits.length === 11 && digits.startsWith('51')) return digits;
  if (digits.length === 12 && digits.startsWith('51')) return digits;
  return digits;
}

export function validatePeruNumber(input) {
  if (!input) return 'Ingrese un numero de 9 digitos';
  const digits = input.replace(/\D/g, '');
  if (digits.length !== 9) return 'Debe ingresar exactamente 9 digitos (ej: 987654321)';
  return null;
}

export function formatWaUrl(input) {
  const num = normalizeWaNumber(input);
  return num ? `https://wa.me/${num}` : '#';
}
