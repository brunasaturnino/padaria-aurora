import { describe, expect, it } from 'vitest';
import { searchProducts, visibleProducts } from './catalog';

describe('busca de produtos', () => {
  it('ignora acento e maiúsculas', () => {
    const names = searchProducts('PAO').map((product) => product.id);
    expect(names).toEqual(['pao-frances', 'pao-na-chapa', 'pao-de-queijo', 'misto']);
  });

  it('encontra produto pela descrição', () => {
    expect(searchProducts('catupiry').map((product) => product.id)).toEqual(['coxinha']);
  });

  it('devolve o catálogo quando a busca está vazia', () => {
    expect(searchProducts('   ')).toHaveLength(9);
  });

  it('devolve lista vazia quando nada combina', () => {
    expect(searchProducts('xyz')).toEqual([]);
  });

  it('cruza a busca com a categoria', () => {
    expect(visibleProducts('bebidas', 'cafe').map((product) => product.id)).toEqual(['cafe']);
    expect(visibleProducts('paes', 'cafe')).toEqual([]);
  });
});
