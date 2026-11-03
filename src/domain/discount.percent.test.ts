import { describe, expect, it } from 'vitest';
import { addProduct } from './cart';
import { discountCents } from './discount';

describe('cupom percentual', () => {
  it('aplica dez por cento na coxinha', () => {
    expect(discountCents(addProduct([], 'coxinha'), 'AURORA10')).toBe(90);
  });

  it('aplica dez por cento no pão francês', () => {
    expect(discountCents(addProduct([], 'pao-frances'), 'AURORA10')).toBe(15);
  });

  it('aplica dez por cento sobre o pedido inteiro', () => {
    const cart = addProduct(addProduct([], 'pao-frances'), 'coxinha');
    expect(discountCents(cart, 'AURORA10')).toBe(105);
  });
});
