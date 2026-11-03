import { beforeEach, describe, expect, it } from 'vitest';
import { mountBalcao } from './mount';

function openBalcao(): HTMLElement {
  document.body.innerHTML = '<div id="app"></div>';
  const root = document.getElementById('app');
  if (!(root instanceof HTMLElement)) throw new Error('sem balcão');
  mountBalcao(root);
  return root;
}

describe('pagamento na tela', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = openBalcao();
    root.querySelector<HTMLButtonElement>('[data-product="pao-frances"]')?.click();
    root.querySelector<HTMLButtonElement>('[data-action="increase"][data-product="pao-frances"]')?.click();
  });

  it('mostra o troco do dinheiro', () => {
    const paid = root.querySelector<HTMLInputElement>('#recebido');
    if (!paid) throw new Error('valor ausente');
    paid.value = '10,00';
    root.querySelector<HTMLButtonElement>('[data-action="pay"]')?.click();
    expect(root.querySelector('.comprovante')?.textContent).toContain('7,00');
  });

  it('avisa quando o dinheiro não cobre', () => {
    const paid = root.querySelector<HTMLInputElement>('#recebido');
    if (!paid) throw new Error('valor ausente');
    paid.value = '1,00';
    root.querySelector<HTMLButtonElement>('[data-action="pay"]')?.click();
    expect(root.querySelector('[role="status"]')?.textContent).toBe('O valor em dinheiro não cobre a conta.');
    expect(root.querySelector('.comprovante')).toBeNull();
  });

  it('não fecha a conta com outra tecla', () => {
    const paid = root.querySelector<HTMLInputElement>('#recebido');
    if (!paid) throw new Error('valor ausente');
    paid.value = '10,00';
    paid.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    expect(root.querySelector('.comprovante')).toBeNull();
  });

  it('fecha a conta com Enter no valor recebido', () => {
    const paid = root.querySelector<HTMLInputElement>('#recebido');
    if (!paid) throw new Error('valor ausente');
    paid.value = '10,00';
    paid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(root.querySelector('.comprovante')?.textContent).toContain('7,00');
  });

  it('fecha no pix sem pedir o valor', () => {
    const method = root.querySelector<HTMLSelectElement>('#pagamento');
    if (!method) throw new Error('pagamento ausente');
    method.value = 'pix';
    method.dispatchEvent(new Event('change', { bubbles: true }));
    expect(root.querySelector('#recebido')).toBeNull();
    root.querySelector<HTMLButtonElement>('[data-action="pay"]')?.click();
    expect(root.querySelector('.comprovante')?.textContent).toContain('Pix');
    expect(root.querySelector('.comprovante')?.textContent?.replace(/\s/g, '')).toContain('R$0,00');
  });
});
