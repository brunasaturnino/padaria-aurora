import { describe, expect, it } from 'vitest';
import { addProduct } from '../domain/cart';
import { chooseMethod, createOrder, pay } from './order';

describe('fechamento da conta', () => {
  it('calcula o troco em dinheiro', () => {
    const result = pay({
      ...createOrder(),
      cart: addProduct([], 'pao-frances', 2),
      paidInput: '10,00',
    });
    expect(result.notice).toBeNull();
    expect(result.receipt?.changeCents).toBe(700);
  });

  it('recusa dinheiro insuficiente', () => {
    const result = pay({
      ...createOrder(),
      cart: addProduct([], 'pao-frances'),
      paidInput: '1,00',
    });
    expect(result.receipt).toBeNull();
    expect(result.notice).toBe('O valor em dinheiro não cobre a conta.');
  });

  it('recusa valor digitado inválido', () => {
    const result = pay({
      ...createOrder(),
      cart: addProduct([], 'cafe'),
      paidInput: 'abc',
    });
    expect(result.notice).toBe('Use um valor como 12,50.');
  });

  it('cobra o total no pix e ignora o valor digitado', () => {
    const result = pay({
      ...createOrder(),
      cart: addProduct([], 'coxinha'),
      appliedCoupon: 'AURORA10',
      method: 'pix',
      paidInput: 'abc',
    });
    expect(result.notice).toBeNull();
    expect(result.receipt).toMatchObject({ method: 'pix', totalCents: 810, changeCents: 0 });
  });

  it('pede um item antes de fechar a conta', () => {
    expect(pay(createOrder()).notice).toBe('Adicione um item antes de fechar a conta.');
  });

  it('avisa quando o cupom aplicado não existe', () => {
    const result = pay({
      ...createOrder(),
      cart: addProduct([], 'cafe'),
      appliedCoupon: 'NAOEXISTE',
      method: 'pix',
    });
    expect(result.receipt).toBeNull();
    expect(result.notice).toBe('Esse cupom não existe.');
  });

  it('troca a forma de pagamento e apaga o comprovante', () => {
    const paid = pay({ ...createOrder(), cart: addProduct([], 'cafe'), paidInput: '5,00' });
    expect(chooseMethod(paid, 'dinheiro')).toBe(paid);
    const pix = chooseMethod(paid, 'pix');
    expect(pix.method).toBe('pix');
    expect(pix.receipt).toBeNull();
  });

  it('mantém o comprovante se a forma de pagamento é inválida', () => {
    const paid = pay({ ...createOrder(), cart: addProduct([], 'cafe'), paidInput: '5,00' });
    const invalid = chooseMethod(paid, 'boleto');
    expect(invalid.receipt).toBe(paid.receipt);
    expect(invalid.notice).toBe('Escolha dinheiro, pix ou cartão.');
  });
});
