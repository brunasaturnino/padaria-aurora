import { beforeEach, describe, expect, it } from 'vitest';
import { mountBalcao } from './mount';

function openBalcao(): HTMLElement {
  document.body.innerHTML = '<div id="app"></div>';
  const root = document.getElementById('app');
  if (!(root instanceof HTMLElement)) {
    throw new Error('sem balcão');
  }
  mountBalcao(root);
  return root;
}

describe('cliques do pedido', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = openBalcao();
  });

  it('mostra o balcão vazio', () => {
    expect(root.querySelector('h1')?.textContent).toBe('Balcão de pedidos');
    expect(root.textContent).toContain('Nenhum item no pedido.');
  });

  it('inclui o pão francês', () => {
    root.querySelector<HTMLButtonElement>('[data-product="pao-frances"]')?.click();
    expect(root.querySelector('#qtd-pao-frances')?.textContent).toBe('1');
    expect(root.querySelector('#total')?.textContent?.replace(/\s/g, '')).toContain('1,50');
  });

  it('aumenta e remove a quantidade', () => {
    root.querySelector<HTMLButtonElement>('[data-action="add"][data-product="pao-frances"]')?.click();
    root.querySelector<HTMLButtonElement>('[data-action="increase"][data-product="pao-frances"]')?.click();
    expect(root.querySelector('#qtd-pao-frances')?.textContent).toBe('2');
    root.querySelector<HTMLButtonElement>('[data-action="decrease"][data-product="pao-frances"]')?.click();
    expect(root.querySelector('#qtd-pao-frances')?.textContent).toBe('1');
    root.querySelector<HTMLButtonElement>('[data-action="remove"][data-product="pao-frances"]')?.click();
    expect(root.querySelector('#qtd-pao-frances')).toBeNull();
  });

  it('filtra os pães', () => {
    root.querySelector<HTMLButtonElement>('[data-category="paes"]')?.click();
    expect(root.querySelector('[data-product="pao-frances"]')).not.toBeNull();
    expect(root.querySelector('[data-product="coxinha"]')).toBeNull();
  });

  it('busca a coxinha', () => {
    const search = root.querySelector<HTMLInputElement>('#busca');
    if (!search) throw new Error('busca ausente');
    search.value = 'cox';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    expect(root.querySelector('[data-product="coxinha"]')).not.toBeNull();
    expect(root.querySelector('[data-product="pao-frances"]')).toBeNull();
  });

  it('ignora clique fora dos botões e ação desconhecida', () => {
    root.querySelector('h1')?.click();
    root.insertAdjacentHTML('beforeend', '<button type="button" data-action="nada">Nada</button>');
    root.querySelector<HTMLButtonElement>('[data-action="nada"]')?.click();
    expect(root.querySelector('h1')?.textContent).toBe('Balcão de pedidos');
  });
});
