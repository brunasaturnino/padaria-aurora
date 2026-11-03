import { describe, expect, it } from 'vitest';
import { formatCents } from './money';

function compact(value: string): string {
  return value.replace(/\s/g, '');
}

describe('formatação de reais', () => {
  it('formata zero', () => {
    expect(compact(formatCents(0))).toBe('R$0,00');
  });

  it('formata centavos', () => {
    expect(compact(formatCents(150))).toBe('R$1,50');
  });

  it('formata milhar', () => {
    expect(compact(formatCents(123456))).toBe('R$1.234,56');
  });

  it('rejeita centavo fracionário', () => {
    expect(() => formatCents(10.5)).toThrow('centavos');
  });

  it('rejeita valor negativo', () => {
    expect(() => formatCents(-1)).toThrow('centavos');
  });
});
