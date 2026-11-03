import { describe, expect, it } from 'vitest';
import { addProduct } from './cart';
import { discountCents } from './discount';

describe('promoção do café', () => {
  it('não desconta antes de três cafés', () => {
    expect(discountCents(addProduct([], 'cafe', 2), 'CAFE3')).toBe(0);
  });

  it('desconta um café a cada três', () => {
    expect(discountCents(addProduct([], 'cafe', 3), 'CAFE3')).toBe(500);
  });

  it('desconta dois cafés em seis unidades', () => {
    expect(discountCents(addProduct([], 'cafe', 6), 'CAFE3')).toBe(1000);
  });

  it('não desconta outros produtos', () => {
    expect(discountCents(addProduct([], 'coxinha', 3), 'CAFE3')).toBe(0);
  });
});
