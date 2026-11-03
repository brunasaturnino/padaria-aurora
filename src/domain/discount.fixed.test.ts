import { describe, expect, it } from 'vitest';
import { addProduct } from './cart';
import { discountCents } from './discount';

describe('cupom de valor fixo', () => {
  it('desconta cinco reais da coxinha', () => {
    expect(discountCents(addProduct([], 'coxinha'), 'DOCE5')).toBe(500);
  });

  it('não deixa o desconto passar do subtotal', () => {
    expect(discountCents(addProduct([], 'pao-frances'), 'DOCE5')).toBe(150);
  });
});
