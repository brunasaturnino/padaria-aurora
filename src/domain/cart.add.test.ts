import { describe, expect, it } from 'vitest';
import { addProduct, MAX_LINE_QUANTITY } from './cart';

describe('inclusão no carrinho', () => {
  it('adiciona um produto novo', () => {
    expect(addProduct([], 'pao-frances')).toEqual([{ productId: 'pao-frances', quantity: 1 }]);
  });

  it('soma a quantidade do mesmo produto', () => {
    const cart = addProduct(addProduct([], 'cafe'), 'cafe');
    expect(cart).toEqual([{ productId: 'cafe', quantity: 2 }]);
  });

  it('mantém o carrinho anterior intacto', () => {
    const original = addProduct([], 'cafe');
    const next = addProduct(original, 'pao-frances');
    expect(original).toEqual([{ productId: 'cafe', quantity: 1 }]);
    expect(next).toHaveLength(2);
  });

  it('rejeita produto desconhecido', () => {
    expect(() => addProduct([], 'fantasma')).toThrow('Produto não encontrado.');
  });

  it('rejeita quantidade inválida', () => {
    expect(() => addProduct([], 'cafe', 0)).toThrow('inteiro maior que zero');
    expect(() => addProduct([], 'cafe', 1.5)).toThrow('inteiro maior que zero');
  });

  it('respeita o limite do balcão', () => {
    expect(() => addProduct([], 'cafe', MAX_LINE_QUANTITY + 1)).toThrow(`até ${MAX_LINE_QUANTITY}`);
  });
});
