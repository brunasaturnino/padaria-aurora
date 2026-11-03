import { describe, expect, it } from 'vitest';
import { addProduct } from './cart';
import { closeOrder } from './checkout';

describe('fechamento inválido', () => {
  it('recusa pedido vazio', () => {
    expect(closeOrder([], '', { method: 'dinheiro', amountCents: 0 })).toEqual({
      ok: false,
      message: 'Adicione um item antes de fechar a conta.',
    });
  });

  it('recusa cupom que não existe', () => {
    expect(closeOrder(addProduct([], 'cafe'), 'NADA', { method: 'pix', amountCents: 500 })).toEqual({
      ok: false,
      message: 'Esse cupom não existe.',
    });
  });

  it('recusa forma de pagamento desconhecida', () => {
    expect(closeOrder(addProduct([], 'cafe'), '', { method: 'boleto', amountCents: 500 })).toEqual({
      ok: false,
      message: 'Escolha dinheiro, pix ou cartão.',
    });
  });

  it('recusa valor pago fracionário', () => {
    expect(closeOrder(addProduct([], 'cafe'), '', { method: 'dinheiro', amountCents: 10.5 })).toEqual({
      ok: false,
      message: 'Informe um valor pago válido.',
    });
  });

  it('recusa valor pago negativo', () => {
    expect(closeOrder(addProduct([], 'cafe'), '', { method: 'dinheiro', amountCents: -1 })).toEqual({
      ok: false,
      message: 'Informe um valor pago válido.',
    });
  });

  it('recusa item que não está no catálogo', () => {
    expect(() =>
      closeOrder([{ productId: 'fantasma', quantity: 1 }], '', { method: 'pix', amountCents: 1 }),
    ).toThrow('Produto não encontrado.');
  });
});
