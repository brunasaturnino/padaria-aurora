import { describe, expect, it } from 'vitest';
import { addProduct } from './cart';
import { discountCents, findCoupon, listCoupons } from './discount';

describe('código do cupom', () => {
  it('aceita letras minúsculas e espaços', () => {
    expect(discountCents(addProduct([], 'coxinha'), '  aurora10 ')).toBe(90);
  });

  it('encontra o cupom de cinco reais', () => {
    expect(findCoupon(' doce5 ')?.code).toBe('DOCE5');
  });

  it('não encontra cupom desconhecido', () => {
    expect(findCoupon('naoexiste')).toBeUndefined();
    expect(() => discountCents(addProduct([], 'cafe'), 'naoexiste')).toThrow('Esse cupom não existe.');
  });

  it('entrega uma cópia da lista de cupons', () => {
    const coupons = listCoupons();
    expect(coupons.map((coupon) => coupon.code)).toEqual(['AURORA10', 'DOCE5', 'CAFE3']);
    coupons.pop();
    expect(listCoupons()).toHaveLength(3);
  });
});
