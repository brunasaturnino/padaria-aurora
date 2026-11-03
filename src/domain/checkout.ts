import { describeLine, type CartLine } from './cart';
import { previewOrder } from './discount';
import { formatCents } from './money';

export const paymentMethods = ['dinheiro', 'pix', 'cartao'] as const;

export type PaymentMethod = (typeof paymentMethods)[number];

export type Receipt = {
  lines: { name: string; quantity: number; totalCents: number }[];
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  method: PaymentMethod;
  paidCents: number;
  changeCents: number;
};

export type CheckoutResult = { ok: true; receipt: Receipt } | { ok: false; message: string };

const methodLabel: Record<PaymentMethod, string> = {
  dinheiro: 'Dinheiro',
  pix: 'Pix',
  cartao: 'Cartão',
};

export function isPaymentMethod(value: string): value is PaymentMethod {
  return (paymentMethods as readonly string[]).includes(value);
}

export function closeOrder(
  cart: readonly CartLine[],
  couponCode: string,
  payment: { method: string; amountCents: number },
): CheckoutResult {
  if (cart.length === 0) {
    return { ok: false, message: 'Adicione um item antes de fechar a conta.' };
  }

  const quote = previewOrder(cart, couponCode);
  if (quote.couponMessage) {
    return { ok: false, message: quote.couponMessage };
  }
  if (!isPaymentMethod(payment.method)) {
    return { ok: false, message: 'Escolha dinheiro, pix ou cartão.' };
  }
  if (!Number.isInteger(payment.amountCents) || payment.amountCents < 0) {
    return { ok: false, message: 'Informe um valor pago válido.' };
  }
  if (payment.method === 'dinheiro' && payment.amountCents < quote.totalCents) {
    return { ok: false, message: 'O valor em dinheiro não cobre a conta.' };
  }
  if (payment.method !== 'dinheiro' && payment.amountCents !== quote.totalCents) {
    return { ok: false, message: 'Pix e cartão precisam pagar o valor exato.' };
  }

  return {
    ok: true,
    receipt: {
      lines: cart.map((line) => describeLine(line)),
      subtotalCents: quote.subtotalCents,
      discountCents: quote.discountCents,
      totalCents: quote.totalCents,
      method: payment.method,
      paidCents: payment.amountCents,
      changeCents: payment.amountCents - quote.totalCents,
    },
  };
}

export function formatReceipt(receipt: Receipt): string {
  const items = receipt.lines.map((line) => `${line.quantity}x ${line.name} — ${formatCents(line.totalCents)}`);
  return [
    'Padaria Aurora',
    ...items,
    `Subtotal: ${formatCents(receipt.subtotalCents)}`,
    `Desconto: ${formatCents(receipt.discountCents)}`,
    `Total: ${formatCents(receipt.totalCents)}`,
    `Forma: ${methodLabel[receipt.method]}`,
    `Pago: ${formatCents(receipt.paidCents)}`,
    `Troco: ${formatCents(receipt.changeCents)}`,
  ].join('\n');
}
