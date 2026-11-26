import { neon } from '@neondatabase/serverless';
import { closeOrder } from '../src/domain/checkout.js';
import type { CartLine } from '../src/domain/cart.js';

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return Response.json({ error: 'Método não permitido.' }, { status: 405 });
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return Response.json({ error: 'Envie os dados em JSON.' }, { status: 415 });
    }
    const url = process.env.DATABASE_URL;
    if (!url) return Response.json({ error: 'O banco de dados não está configurado.' }, { status: 503 });

    try {
      const body: unknown = await request.json();
      if (!body || typeof body !== 'object') throw new Error('Pedido inválido.');
      const data = body as Record<string, unknown>;
      if (!Array.isArray(data.cart) || data.cart.length === 0 || data.cart.length > 9 ||
          !data.cart.every((item: unknown) => item && typeof item === 'object' &&
            typeof (item as CartLine).productId === 'string' &&
            Number.isInteger((item as CartLine).quantity) &&
            (item as CartLine).quantity >= 1 && (item as CartLine).quantity <= 20) ||
          typeof data.couponCode !== 'string' || data.couponCode.length > 32 ||
          typeof data.method !== 'string' || typeof data.amountCents !== 'number') {
        throw new Error('Pedido inválido.');
      }
      const cart = data.cart as CartLine[];
      if (new Set(cart.map((line) => line.productId)).size !== cart.length) throw new Error('Pedido inválido.');
      const result = closeOrder(cart, data.couponCode, { method: data.method, amountCents: data.amountCents });
      if (!result.ok) return Response.json({ error: result.message }, { status: 400 });

      const sql = neon(url);
      const rows = await sql`
        INSERT INTO orders (items, coupon_code, subtotal_cents, discount_cents, total_cents, payment_method, paid_cents, change_cents)
        VALUES (${JSON.stringify(cart)}::jsonb, ${data.couponCode}, ${result.receipt.subtotalCents},
          ${result.receipt.discountCents}, ${result.receipt.totalCents}, ${result.receipt.method},
          ${result.receipt.paidCents}, ${result.receipt.changeCents})
        RETURNING id, created_at
      `;
      return Response.json({ id: rows[0].id, createdAt: rows[0].created_at, receipt: result.receipt }, { status: 201 });
    } catch (error) {
      if (error instanceof Error && (error.message === 'Pedido inválido.' || error.message === 'Produto não encontrado.')) {
        return Response.json({ error: error.message }, { status: 400 });
      }
      return Response.json({ error: 'Não foi possível salvar o pedido. Tente novamente.' }, { status: 500 });
    }
  },
};
