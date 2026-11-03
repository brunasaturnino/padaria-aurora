import { describe, expect, it } from 'vitest';
import { addProduct, changeQuantity, MAX_LINE_QUANTITY, removeProduct } from './cart';

describe('quantidade do pedido', () => {
  it('altera a quantidade de um item', () => {
    const cart = changeQuantity(addProduct([], 'cafe'), 'cafe', 4);
    expect(cart).toEqual([{ productId: 'cafe', quantity: 4 }]);
  });

  it('remove o item quando a quantidade chega a zero', () => {
    expect(changeQuantity(addProduct([], 'cafe'), 'cafe', 0)).toEqual([]);
  });

  it('não altera o carrinho recebido', () => {
    const original = addProduct([], 'cafe', 2);
    changeQuantity(original, 'cafe', 1);
    expect(original[0]?.quantity).toBe(2);
  });

  it('avisa quando o item não está no pedido', () => {
    expect(() => changeQuantity([], 'cafe', 1)).toThrow('não está no pedido');
  });

  it('rejeita quantidade negativa', () => {
    expect(() => changeQuantity(addProduct([], 'cafe'), 'cafe', -1)).toThrow('maior ou igual a zero');
  });

  it('rejeita quantidade acima do limite', () => {
    const cart = addProduct([], 'cafe');
    expect(() => changeQuantity(cart, 'cafe', MAX_LINE_QUANTITY + 1)).toThrow(`até ${MAX_LINE_QUANTITY}`);
  });

  it('remover um item ausente devolve o pedido sem ele', () => {
    const cart = addProduct([], 'cafe');
    expect(removeProduct(cart, 'pao-frances')).toEqual(cart);
    expect(removeProduct(cart, 'cafe')).toEqual([]);
  });
});
