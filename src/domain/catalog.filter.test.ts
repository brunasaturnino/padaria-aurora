import { describe, expect, it } from 'vitest';
import { filterProducts } from './catalog';

describe('filtro do catálogo', () => {
  it('lista só os doces', () => {
    expect(filterProducts('doces').map((product) => product.id)).toEqual(['sonho', 'bolo-fuba']);
  });

  it('lista o balcão inteiro', () => {
    expect(filterProducts('todas')).toHaveLength(9);
  });

  it('rejeita categoria desconhecida', () => {
    expect(() => filterProducts('frios')).toThrow('Categoria desconhecida.');
  });
});
