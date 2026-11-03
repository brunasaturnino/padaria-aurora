import { requireProduct } from './catalog';
import { subtotalCents, type CartLine } from './cart';

export type Coupon =
  | { code: string; description: string; kind: 'percent'; percent: number }
  | { code: string; description: string; kind: 'fixed'; amountCents: number }
  | { code: string; description: string; kind: 'bogo'; productId: string };

export type Quote = {
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  couponDescription: string | null;
  couponMessage: string | null;
};

const coupons: readonly Coupon[] = [
  { code: 'AURORA10', description: '10% no pedido', kind: 'percent', percent: 10 },
  { code: 'DOCE5', description: 'R$ 5,00 de desconto', kind: 'fixed', amountCents: 500 },
  { code: 'CAFE3', description: 'A cada 3 cafés, 1 sai de graça', kind: 'bogo', productId: 'cafe' },
];

function copyCoupon(coupon: Coupon): Coupon {
  return { ...coupon };
}

export function listCoupons(): Coupon[] {
  return coupons.map(copyCoupon);
}

export function findCoupon(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase();
  const coupon = coupons.find((item) => item.code === normalized);
  return coupon ? copyCoupon(coupon) : undefined;
}

function calculateDiscount(cart: readonly CartLine[], coupon: Coupon): number {
  if (coupon.kind === 'bogo') {
    const line = cart.find((item) => item.productId === coupon.productId);
    if (!line) {
      return 0;
    }
    return Math.floor(line.quantity / 3) * requireProduct(coupon.productId).priceCents;
  }

  const subtotal = subtotalCents(cart);
  if (coupon.kind === 'percent') {
    return Math.floor((subtotal * coupon.percent) / 100);
  }
  return Math.min(subtotal, coupon.amountCents);
}

export function discountCents(cart: readonly CartLine[], code: string): number {
  const coupon = findCoupon(code);
  if (!coupon) {
    throw new Error('Esse cupom não existe.');
  }
  return calculateDiscount(cart, coupon);
}

function quote(
  subtotalCentsValue: number,
  discount: number,
  couponDescription: string | null,
  couponMessage: string | null,
): Quote {
  return {
    subtotalCents: subtotalCentsValue,
    discountCents: discount,
    totalCents: subtotalCentsValue - discount,
    couponDescription,
    couponMessage,
  };
}

export function previewOrder(cart: readonly CartLine[], couponCode: string): Quote {
  const subtotal = subtotalCents(cart);
  if (!couponCode.trim()) {
    return quote(subtotal, 0, null, null);
  }

  const coupon = findCoupon(couponCode);
  if (!coupon) {
    return quote(subtotal, 0, null, 'Esse cupom não existe.');
  }

  return quote(subtotal, calculateDiscount(cart, coupon), coupon.description, null);
}
