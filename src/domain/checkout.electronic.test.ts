import { describe, expect, it } from 'vitest';
import { addProduct } from './cart';
import { closeOrder } from './checkout';

describe('pix e cartão', () => {
  it('fecha no pix com o valor exato', () => {
    const result = closeOrder(addProduct([], 'cafe'), '', { method: 'pix', amountCents: 500 });
    expect(result).toMatchObject({
      ok: true,
      receipt: { method: 'pix', totalCents: 500, changeCents: 0 },
    });
  });

  it('recusa pix com valor diferente', () => {
    expect(closeOrder(addProduct([], 'coxinha'), '', { method: 'pix', amountCents: 901 })).toEqual({
      ok: false,
      message: 'Pix e cartão precisam pagar o valor exato.',
    });
  });

  it('aplica o cupom antes de cobrar no cartão', () => {
    const result = closeOrder(addProduct([], 'coxinha'), 'AURORA10', {
      method: 'cartao',
      amountCents: 810,
    });
    expect(result).toMatchObject({
      ok: true,
      receipt: { method: 'cartao', discountCents: 90, totalCents: 810, changeCents: 0 },
    });
  });
});
