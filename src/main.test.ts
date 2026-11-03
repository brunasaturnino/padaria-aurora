import { beforeEach, describe, expect, it } from 'vitest';

describe('abertura da página', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('monta o balcão quando a página tem a área principal', async () => {
    document.body.innerHTML = '<div id="app"></div>';
    await import('./main');
    expect(document.querySelector('h1')?.textContent).toBe('Balcão de pedidos');
  });

  it('avisa quando a página não tem a área do balcão', async () => {
    const { startBalcao } = await import('./app/mount');
    expect(() => startBalcao(document)).toThrow('Não encontrei a área do balcão.');
  });
});
