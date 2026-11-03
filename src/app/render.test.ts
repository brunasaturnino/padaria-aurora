import { describe, expect, it } from 'vitest';
import { addProduct } from '../domain/cart';
import { createOrder, pay, type OrderState } from './order';
import { renderBalcao } from './render';

function htmlOf(patch: Partial<OrderState> = {}): string {
  return renderBalcao({ ...createOrder(), ...patch });
}

describe('desenho do balcão', () => {
  it('mostra os produtos, o pedido vazio e os cupons', () => {
    const html = htmlOf();
    expect(html).toContain('Balcão de pedidos');
    expect(html).toContain('Pão francês');
    expect(html).toContain('Nenhum item no pedido.');
    expect(html).toContain('AURORA10');
    expect(html.replace(/\s/g, '')).toContain('R$1,50');
  });

  it('mostra a linha e o total do pedido', () => {
    const html = htmlOf({ cart: addProduct([], 'pao-frances', 2) });
    expect(html).toContain('id="qtd-pao-frances">2');
    expect(html.replace(/\s/g, '')).toContain('R$3,00');
  });

  it('escapa o que a pessoa digita', () => {
    const html = htmlOf({ couponInput: '<b>', notice: 'a&b' });
    expect(html).toContain('&lt;b&gt;');
    expect(html).not.toContain('<b>');
    expect(html).toContain('a&amp;b');
  });

  it('esconde o valor recebido no pix', () => {
    const html = htmlOf({ method: 'pix' });
    expect(html).toContain('id="valor-exato"');
    expect(html).not.toContain('id="recebido"');
  });

  it('mostra o comprovante depois do pagamento', () => {
    const paid = pay({
      ...createOrder(),
      cart: addProduct([], 'pao-frances', 2),
      paidInput: '10,00',
    });
    const html = renderBalcao(paid);
    expect(html).toContain('aria-label="Comprovante"');
    expect(html).toContain('Troco:');
  });

  it('avisa quando a busca não encontra produto', () => {
    expect(htmlOf({ query: 'xyz' })).toContain('Nenhum produto encontrado.');
  });

  it('destaca a categoria escolhida', () => {
    const html = htmlOf({ category: 'paes' });
    expect(html).toContain('data-category="paes" aria-pressed="true"');
    expect(html).not.toContain('data-product="coxinha"');
  });

  it('mostra o aviso de um cupom aplicado inválido', () => {
    const html = htmlOf({ cart: addProduct([], 'cafe'), appliedCoupon: 'NAO' });
    expect(html).toContain('Esse cupom não existe.');
  });

  it('mostra a descrição do cupom aplicado', () => {
    const html = htmlOf({ cart: addProduct([], 'coxinha'), appliedCoupon: 'AURORA10' });
    expect(html).toContain('id="cupom-ativo"');
    expect(html).toContain('10% no pedido');
    expect(html.replace(/\s/g, '')).toContain('R$8,10');
  });
});
