import { beforeEach, describe, expect, it } from 'vitest';
import { addProduct, MAX_LINE_QUANTITY } from '../domain/cart';
import { addItem, createOrder, decreaseItem, increaseItem, pay, removeItem, type OrderState } from './order';

describe('pedido no balcão', () => {
  let paid: OrderState;

  beforeEach(() => {
    paid = pay({ ...createOrder(), cart: addProduct([], 'cafe'), paidInput: '5,00' });
  });

  it('começa sem itens', () => {
    expect(createOrder().cart).toEqual([]);
    expect(createOrder().category).toBe('todas');
  });

  it('adiciona e soma o mesmo produto', () => {
    const once = addItem(createOrder(), 'pao-frances');
    const twice = addItem(once, 'pao-frances');
    expect(twice.cart).toEqual([{ productId: 'pao-frances', quantity: 2 }]);
  });

  it('mantém o comprovante quando o produto não existe', () => {
    const failed = addItem(paid, 'fantasma');
    expect(failed.notice).toBe('Produto não encontrado.');
    expect(failed.receipt).toBe(paid.receipt);
  });

  it('apaga o comprovante ao incluir um item válido', () => {
    const next = addItem(paid, 'pao-frances');
    expect(next.receipt).toBeNull();
    expect(next.cart).toHaveLength(2);
  });

  it('respeita o limite ao somar mais uma unidade', () => {
    const full = { ...createOrder(), cart: addProduct([], 'cafe', MAX_LINE_QUANTITY) };
    const blocked = addItem(full, 'cafe');
    expect(blocked.cart).toEqual(full.cart);
    expect(blocked.notice).toContain(String(MAX_LINE_QUANTITY));
  });

  it('diminui até remover a última unidade', () => {
    const once = addItem(createOrder(), 'cafe');
    expect(decreaseItem(once, 'cafe').cart).toEqual([]);
  });

  it('avisa ao diminuir um item ausente', () => {
    expect(decreaseItem(createOrder(), 'cafe').notice).toBe('Esse item não está no pedido.');
  });

  it('avisa ao aumentar um item ausente', () => {
    expect(increaseItem(createOrder(), 'cafe').notice).toBe('Esse item não está no pedido.');
  });

  it('remove o item escolhido', () => {
    const cart = addItem(addItem(createOrder(), 'cafe'), 'pao-frances');
    expect(removeItem(cart, 'cafe').cart).toEqual([{ productId: 'pao-frances', quantity: 1 }]);
  });
});
