export const productCategories = ['paes', 'salgados', 'doces', 'bebidas'] as const;

export type ProductCategory = (typeof productCategories)[number];

export const catalogFilters = ['todas', ...productCategories] as const;

export type CatalogFilter = (typeof catalogFilters)[number];

export const filterLabel: Record<CatalogFilter, string> = {
  todas: 'Tudo',
  paes: 'Pães',
  salgados: 'Salgados',
  doces: 'Doces',
  bebidas: 'Bebidas',
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  priceCents: number;
};

const products: readonly Product[] = [
  {
    id: 'pao-frances',
    name: 'Pão francês',
    description: 'Unidade quentinha, saída do forno.',
    category: 'paes',
    priceCents: 150,
  },
  {
    id: 'pao-na-chapa',
    name: 'Pão na chapa',
    description: 'Pão francês na chapa com manteiga.',
    category: 'paes',
    priceCents: 800,
  },
  {
    id: 'pao-de-queijo',
    name: 'Pão de queijo',
    description: 'Porção com seis unidades.',
    category: 'paes',
    priceCents: 600,
  },
  {
    id: 'coxinha',
    name: 'Coxinha',
    description: 'Coxinha de frango com catupiry.',
    category: 'salgados',
    priceCents: 900,
  },
  {
    id: 'misto',
    name: 'Misto quente',
    description: 'Pão de forma, queijo e presunto.',
    category: 'salgados',
    priceCents: 1200,
  },
  {
    id: 'sonho',
    name: 'Sonho',
    description: 'Sonho recheado com creme.',
    category: 'doces',
    priceCents: 850,
  },
  {
    id: 'bolo-fuba',
    name: 'Bolo de fubá',
    description: 'Fatia de bolo de fubá.',
    category: 'doces',
    priceCents: 700,
  },
  {
    id: 'cafe',
    name: 'Café',
    description: 'Café coado, xícara pequena.',
    category: 'bebidas',
    priceCents: 500,
  },
  {
    id: 'suco',
    name: 'Suco de laranja',
    description: 'Suco natural, copo de 300 ml.',
    category: 'bebidas',
    priceCents: 900,
  },
];

function copyProduct(product: Product): Product {
  return { ...product };
}

function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

export function isCatalogFilter(value: string): value is CatalogFilter {
  return (catalogFilters as readonly string[]).includes(value);
}

export function listProducts(): Product[] {
  return products.map(copyProduct);
}

export function findProduct(productId: string): Product | undefined {
  const product = products.find((item) => item.id === productId);
  return product ? copyProduct(product) : undefined;
}

export function requireProduct(productId: string): Product {
  const product = findProduct(productId);
  if (!product) {
    throw new Error('Produto não encontrado.');
  }
  return product;
}

export function searchProducts(query: string): Product[] {
  const term = normalizeText(query);
  if (!term) {
    return listProducts();
  }
  return listProducts().filter((product) => {
    const name = normalizeText(product.name);
    const description = normalizeText(product.description);
    return name.includes(term) || description.includes(term);
  });
}

export function filterProducts(category: string): Product[] {
  if (!isCatalogFilter(category)) {
    throw new Error('Categoria desconhecida.');
  }
  if (category === 'todas') {
    return listProducts();
  }
  return listProducts().filter((product) => product.category === category);
}

export function visibleProducts(category: string, query: string): Product[] {
  const ids = new Set(filterProducts(category).map((product) => product.id));
  return searchProducts(query).filter((product) => ids.has(product.id));
}
