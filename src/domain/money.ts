const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCents(cents: number): string {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new Error('O valor deve ser um total de centavos maior ou igual a zero.');
  }
  return brl.format(cents / 100);
}

export function parseReaisToCents(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Informe um valor em reais.');
  }

  const withoutSymbol = trimmed.replace(/^r\$\s*/i, '').trim();
  if (!withoutSymbol) {
    throw new Error('Informe um valor em reais.');
  }
  if (withoutSymbol.startsWith('-')) {
    throw new Error('O valor não pode ser negativo.');
  }

  let normalized = withoutSymbol;
  const hasComma = normalized.includes(',');
  const hasDot = normalized.includes('.');

  if (hasComma && hasDot) {
    normalized = normalized.replaceAll('.', '').replace(',', '.');
  } else if (hasComma) {
    normalized = normalized.replace(',', '.');
  } else if (hasDot && /^\d{1,3}(\.\d{3})+$/.test(normalized)) {
    normalized = normalized.replaceAll('.', '');
  }

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error('Use um valor como 12,50.');
  }

  const [reaisPart, fraction = ''] = normalized.split('.');
  return Number(reaisPart) * 100 + Number(fraction.padEnd(2, '0'));
}
