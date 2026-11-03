import { catalogFilters, filterLabel, visibleProducts } from '../domain/catalog';
import { describeLine } from '../domain/cart';
import { formatReceipt } from '../domain/checkout';
import { listCoupons, previewOrder } from '../domain/discount';
import { formatCents } from '../domain/money';
import { escapeHtml } from './html';
import type { OrderState } from './order';

export function renderBalcao(state: OrderState): string {
  const quote = previewOrder(state.cart, state.appliedCoupon);
  const products = visibleProducts(state.category, state.query);
  const alertText = state.notice ?? quote.couponMessage;

  const filters = catalogFilters
    .map((filter) => {
      const pressed = state.category === filter ? 'true' : 'false';
      return `<button type="button" class="secundario" data-action="category" data-category="${filter}" aria-pressed="${pressed}">${filterLabel[filter]}</button>`;
    })
    .join('');

  const cards =
    products.length === 0
      ? '<p class="vazio">Nenhum produto encontrado.</p>'
      : products
          .map(
            (product) => `<article class="produto">
              <h3>${escapeHtml(product.name)}</h3>
              <p>${escapeHtml(product.description)}</p>
              <p class="preco">${formatCents(product.priceCents)}</p>
              <button type="button" data-action="add" data-product="${escapeHtml(product.id)}" aria-label="Adicionar ${escapeHtml(product.name)}">Adicionar</button>
            </article>`,
          )
          .join('');

  const lines =
    state.cart.length === 0
      ? '<p class="vazio">Nenhum item no pedido.</p>'
      : state.cart
          .map((line) => {
            const described = describeLine(line);
            return `<article class="linha">
              <div>
                <h3>${escapeHtml(described.name)}</h3>
                <p>${formatCents(described.totalCents)}</p>
              </div>
              <div class="qtd">
                <button type="button" data-action="decrease" data-product="${escapeHtml(line.productId)}" aria-label="Diminuir ${escapeHtml(described.name)}">−</button>
                <span id="qtd-${escapeHtml(line.productId)}">${described.quantity}</span>
                <button type="button" data-action="increase" data-product="${escapeHtml(line.productId)}" aria-label="Aumentar ${escapeHtml(described.name)}">+</button>
                <button type="button" class="secundario" data-action="remove" data-product="${escapeHtml(line.productId)}" aria-label="Remover ${escapeHtml(described.name)}">Remover</button>
              </div>
            </article>`;
          })
          .join('');

  const payment =
    state.method === 'dinheiro'
      ? `<label for="recebido">Valor recebido</label>
         <input id="recebido" inputmode="decimal" value="${escapeHtml(state.paidInput)}" autocomplete="off" />`
      : '<p id="valor-exato">Pix e cartão recebem o valor exato.</p>';

  const couponNote = quote.couponDescription
    ? `<p id="cupom-ativo">${escapeHtml(quote.couponDescription)}</p>`
    : '';

  const notice = alertText ? `<p class="aviso" role="status">${escapeHtml(alertText)}</p>` : '';

  const receipt = state.receipt
    ? `<section class="comprovante" aria-label="Comprovante">
        <h2>Comprovante</h2>
        <pre>${escapeHtml(formatReceipt(state.receipt))}</pre>
      </section>`
    : '';

  return `<main class="balcao">
    <header class="topo">
      <p class="marca">Padaria Aurora</p>
      <h1>Balcão de pedidos</h1>
      <p class="apoio">Monte o pedido, aplique um cupom e feche a conta.</p>
    </header>
    <div class="layout">
      <section class="painel" aria-label="Catálogo">
        <h2>Produtos</h2>
        <label for="busca">Buscar produto</label>
        <input id="busca" type="search" value="${escapeHtml(state.query)}" placeholder="Pão, café, coxinha..." />
        <div class="filtros">${filters}</div>
        <div class="grade">${cards}</div>
      </section>
      <section class="painel pedido" aria-label="Pedido">
        <h2>Pedido</h2>
        ${lines}
        <dl class="totais">
          <div><dt>Subtotal</dt><dd id="subtotal">${formatCents(quote.subtotalCents)}</dd></div>
          <div><dt>Desconto</dt><dd id="desconto">${formatCents(quote.discountCents)}</dd></div>
          <div><dt>Total do pedido</dt><dd id="total">${formatCents(quote.totalCents)}</dd></div>
        </dl>
        ${couponNote}
        <ul class="cupons" aria-label="Cupons disponíveis">
          ${listCoupons()
            .map((coupon) => `<li><code>${escapeHtml(coupon.code)}</code> ${escapeHtml(coupon.description)}</li>`)
            .join('')}
        </ul>
        <label for="cupom">Cupom</label>
        <input id="cupom" value="${escapeHtml(state.couponInput)}" autocomplete="off" />
        <button type="button" data-action="apply-coupon">Aplicar cupom</button>
        <label for="pagamento">Forma de pagamento</label>
        <select id="pagamento">
          <option value="dinheiro"${state.method === 'dinheiro' ? ' selected' : ''}>Dinheiro</option>
          <option value="pix"${state.method === 'pix' ? ' selected' : ''}>Pix</option>
          <option value="cartao"${state.method === 'cartao' ? ' selected' : ''}>Cartão</option>
        </select>
        ${payment}
        <button type="button" data-action="pay">Fechar conta</button>
        ${notice}
        ${receipt}
      </section>
    </div>
  </main>`;
}
