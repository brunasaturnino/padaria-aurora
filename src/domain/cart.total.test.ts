import { describe, expect, it } from 'vitest';
import { addProduct, lineTotalCents, subtotalCents } from './cart';

describe('totais do carrinho', () => {
  it('calcula o total da linha', () => {
    expect(lineTotalCents({ productId: 'pao-frances', quantity: 2 })).toBe(300);
  });

  it('soma os itens do pedido', () => {
    const cart = addProduct(addProduct([], 'pao-frances'), 'cafe');
    expect(subtotalCents(cart)).toBe(650);
  });

  it('considera zero quando o pedido está vazio', () => {
    expect(subtotalCents([])).toBe(0);
  });

  it('rejeita linha com quantidade inválida', () => {
    expect(() => lineTotalCents({ productId: 'cafe', quantity: 0 })).toThrow('inválida');
  });

  it('rejeita linha de produto desconhecido', () => {
    expect(() => lineTotalCents({ productId: 'fantasma', quantity: 1 })).toThrow('Produto não encontrado.');
  });
});
