import { describe, expect, it } from 'vitest';
import { addProduct } from './cart';
import { closeOrder, formatReceipt } from './checkout';

describe('comprovante', () => {
  it('lista os itens, a forma de pagamento e o troco', () => {
    const result = closeOrder(addProduct(addProduct([], 'pao-frances', 2), 'cafe'), '', {
      method: 'dinheiro',
      amountCents: 1000,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const text = formatReceipt(result.receipt);
    expect(text).toContain('Padaria Aurora');
    expect(text).toContain('2x Pão francês');
    expect(text).toContain('1x Café');
    expect(text).toContain('Forma: Dinheiro');
    expect(text).toContain('Troco:');
    expect(result.receipt.lines.map((line) => line.name)).toEqual(['Pão francês', 'Café']);
  });
});
