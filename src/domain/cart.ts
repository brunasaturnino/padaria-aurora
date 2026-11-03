import { requireProduct } from './catalog';

export const MAX_LINE_QUANTITY = 20;

export type CartLine = {
  productId: string;
  quantity: number;
};

export type LineDescription = {
  name: string;
  quantity: number;
  totalCents: number;
};

function copyCart(cart: readonly CartLine[]): CartLine[] {
  return cart.map((line) => ({ ...line }));
}

export function addProduct(cart: readonly CartLine[], productId: string, quantity = 1): CartLine[] {
  requireProduct(productId);
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error('A quantidade precisa ser um inteiro maior que zero.');
  }

  const current = cart.find((line) => line.productId === productId)?.quantity ?? 0;
  const next = current + quantity;
  if (next > MAX_LINE_QUANTITY) {
    throw new Error(`O balcão aceita até ${MAX_LINE_QUANTITY} unidades de cada item.`);
  }

  if (current === 0) {
    return [...copyCart(cart), { productId, quantity: next }];
  }

  return cart.map((line) => (line.productId === productId ? { productId, quantity: next } : { ...line }));
}

export function changeQuantity(cart: readonly CartLine[], productId: string, quantity: number): CartLine[] {
  requireProduct(productId);
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error('A quantidade precisa ser um inteiro maior ou igual a zero.');
  }
  if (quantity > MAX_LINE_QUANTITY) {
    throw new Error(`O balcão aceita até ${MAX_LINE_QUANTITY} unidades de cada item.`);
  }

  const exists = cart.some((line) => line.productId === productId);
  if (!exists) {
    throw new Error('Esse item não está no pedido.');
  }
  if (quantity === 0) {
    return removeProduct(cart, productId);
  }
  return cart.map((line) => (line.productId === productId ? { productId, quantity } : { ...line }));
}

export function removeProduct(cart: readonly CartLine[], productId: string): CartLine[] {
  return copyCart(cart).filter((line) => line.productId !== productId);
}

export function describeLine(line: CartLine): LineDescription {
  const product = requireProduct(line.productId);
  if (!Number.isInteger(line.quantity) || line.quantity < 1) {
    throw new Error('A quantidade do item é inválida.');
  }
  return {
    name: product.name,
    quantity: line.quantity,
    totalCents: product.priceCents * line.quantity,
  };
}

export function lineTotalCents(line: CartLine): number {
  return describeLine(line).totalCents;
}

export function subtotalCents(cart: readonly CartLine[]): number {
  return cart.reduce((sum, line) => sum + lineTotalCents(line), 0);
}
