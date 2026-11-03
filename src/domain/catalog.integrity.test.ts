import { describe, expect, it } from 'vitest';
import { findProduct, listProducts } from './catalog';

describe('integridade do catálogo', () => {
  it('entrega uma cópia da lista', () => {
    const products = listProducts();
    products.pop();
    expect(listProducts()).toHaveLength(9);
  });

  it('usa um id único para cada produto', () => {
    const ids = listProducts().map((product) => product.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cobra um preço inteiro e positivo', () => {
    for (const product of listProducts()) {
      expect(Number.isInteger(product.priceCents)).toBe(true);
      expect(product.priceCents).toBeGreaterThan(0);
    }
  });

  it('encontra o café e copia o cadastro', () => {
    const coffee = findProduct('cafe');
    expect(coffee?.name).toBe('Café');
    if (!coffee) return;
    coffee.priceCents = 1;
    expect(findProduct('cafe')?.priceCents).toBe(500);
  });

  it('não encontra produto fora do balcão', () => {
    expect(findProduct('fantasma')).toBeUndefined();
  });
});
