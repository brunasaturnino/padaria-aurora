import { describe, expect, it } from 'vitest';
import { addProduct } from './cart';
import { closeOrder } from './checkout';

describe('pagamento em dinheiro', () => {
  it('aceita o valor exato sem troco', () => {
    const result = closeOrder(addProduct([], 'pao-frances', 2), '', {
      method: 'dinheiro',
      amountCents: 300,
    });
    expect(result).toMatchObject({ ok: true, receipt: { totalCents: 300, changeCents: 0 } });
  });

  it('calcula o troco quando sobra dinheiro', () => {
    const result = closeOrder(addProduct([], 'pao-frances', 2), '', {
      method: 'dinheiro',
      amountCents: 1000,
    });
    expect(result).toMatchObject({ ok: true, receipt: { changeCents: 700, method: 'dinheiro' } });
  });

  it('recusa dinheiro menor que a conta', () => {
    expect(
      closeOrder(addProduct([], 'pao-frances'), '', { method: 'dinheiro', amountCents: 100 }),
    ).toEqual({ ok: false, message: 'O valor em dinheiro não cobre a conta.' });
  });

  it('ignora cupom em branco', () => {
    const result = closeOrder(addProduct([], 'cafe'), '   ', { method: 'dinheiro', amountCents: 500 });
    expect(result).toMatchObject({ ok: true, receipt: { discountCents: 0, totalCents: 500 } });
  });
});
