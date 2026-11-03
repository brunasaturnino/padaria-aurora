import { beforeEach, describe, expect, it } from 'vitest';
import { mountBalcao } from './mount';

function openBalcao(): HTMLElement {
  document.body.innerHTML = '<div id="app"></div>';
  const root = document.getElementById('app');
  if (!(root instanceof HTMLElement)) throw new Error('sem balcão');
  mountBalcao(root);
  return root;
}

describe('cupom na tela', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = openBalcao();
  });

  it('não aplica o cupom só por digitar', () => {
    root.querySelector<HTMLButtonElement>('[data-product="coxinha"]')?.click();
    const coupon = root.querySelector<HTMLInputElement>('#cupom');
    if (!coupon) throw new Error('cupom ausente');
    coupon.value = 'AURORA10';
    coupon.dispatchEvent(new Event('input', { bubbles: true }));
    expect(root.querySelector('#cupom-ativo')).toBeNull();
  });

  it('aplica o cupom pelo botão', () => {
    root.querySelector<HTMLButtonElement>('[data-product="coxinha"]')?.click();
    const coupon = root.querySelector<HTMLInputElement>('#cupom');
    if (!coupon) throw new Error('cupom ausente');
    coupon.value = 'AURORA10';
    root.querySelector<HTMLButtonElement>('[data-action="apply-coupon"]')?.click();
    expect(root.querySelector('#cupom-ativo')?.textContent).toBe('10% no pedido');
    expect(root.querySelector('#desconto')?.textContent?.replace(/\s/g, '')).toContain('0,90');
    expect(root.querySelector('#total')?.textContent?.replace(/\s/g, '')).toContain('8,10');
  });

  it('aplica o cupom com Enter', () => {
    root.querySelector<HTMLButtonElement>('[data-product="coxinha"]')?.click();
    const coupon = root.querySelector<HTMLInputElement>('#cupom');
    if (!coupon) throw new Error('cupom ausente');
    coupon.value = 'aurora10';
    coupon.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(root.querySelector('#cupom-ativo')?.textContent).toBe('10% no pedido');
  });

  it('mostra erro quando o cupom não existe', () => {
    const coupon = root.querySelector<HTMLInputElement>('#cupom');
    if (!coupon) throw new Error('cupom ausente');
    coupon.value = 'XYZ';
    root.querySelector<HTMLButtonElement>('[data-action="apply-coupon"]')?.click();
    expect(root.querySelector('[role="status"]')?.textContent).toBe('Esse cupom não existe.');
  });

  it('ignora mudança que não vem da forma de pagamento', () => {
    root.querySelector('#cupom')?.dispatchEvent(new Event('change', { bubbles: true }));
    expect(root.querySelector('#recebido')).not.toBeNull();
  });
});
