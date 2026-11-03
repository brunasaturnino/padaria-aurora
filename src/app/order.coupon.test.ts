import { describe, expect, it } from 'vitest';
import { addProduct } from '../domain/cart';
import { applyCoupon, chooseCategory, createOrder, pay } from './order';

describe('cupom e categoria', () => {
  it('aplica o cupom escrito em minúsculas', () => {
    const state = applyCoupon({
      ...createOrder(),
      cart: addProduct([], 'coxinha'),
      couponInput: ' aurora10 ',
    });
    expect(state.appliedCoupon).toBe('AURORA10');
    expect(state.notice).toBe('Cupom AURORA10 aplicado.');
  });

  it('mantém o cupom anterior quando o novo código não existe', () => {
    const applied = applyCoupon({
      ...createOrder(),
      cart: addProduct([], 'cafe'),
      couponInput: 'DOCE5',
    });
    const paid = pay({ ...applied, method: 'pix' });
    const failed = applyCoupon({ ...paid, couponInput: 'XYZ' });
    expect(failed.appliedCoupon).toBe('DOCE5');
    expect(failed.notice).toBe('Esse cupom não existe.');
    expect(failed.receipt).toBe(paid.receipt);
  });

  it('remove o cupom quando o campo fica vazio', () => {
    const applied = applyCoupon({
      ...createOrder(),
      cart: addProduct([], 'cafe'),
      couponInput: 'AURORA10',
    });
    const cleared = applyCoupon({ ...applied, couponInput: '   ' });
    expect(cleared.appliedCoupon).toBe('');
    expect(cleared.notice).toBe('Cupom removido.');
    expect(cleared.receipt).toBeNull();
  });

  it('filtra a categoria escolhida', () => {
    expect(chooseCategory(createOrder(), 'paes').category).toBe('paes');
  });

  it('avisa quando a categoria não existe', () => {
    const current = chooseCategory(createOrder(), 'doces');
    const failed = chooseCategory(current, 'frios');
    expect(failed.category).toBe('doces');
    expect(failed.notice).toBe('Categoria desconhecida.');
  });
});
