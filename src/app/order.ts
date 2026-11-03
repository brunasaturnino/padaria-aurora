import { isCatalogFilter, type CatalogFilter } from '../domain/catalog';
import { addProduct, changeQuantity, removeProduct, type CartLine } from '../domain/cart';
import { closeOrder, isPaymentMethod, type PaymentMethod, type Receipt } from '../domain/checkout';
import { findCoupon, previewOrder } from '../domain/discount';
import { parseReaisToCents } from '../domain/money';

export type OrderState = {
  cart: CartLine[];
  query: string;
  category: CatalogFilter;
  couponInput: string;
  appliedCoupon: string;
  method: PaymentMethod;
  paidInput: string;
  notice: string | null;
  receipt: Receipt | null;
};

export function createOrder(): OrderState {
  return {
    cart: [],
    query: '',
    category: 'todas',
    couponInput: '',
    appliedCoupon: '',
    method: 'dinheiro',
    paidInput: '',
    notice: null,
    receipt: null,
  };
}

function textFrom(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Não foi possível concluir a operação.';
}

export function addItem(state: OrderState, productId: string): OrderState {
  try {
    return { ...state, cart: addProduct(state.cart, productId), notice: null, receipt: null };
  } catch (error) {
    return { ...state, notice: textFrom(error) };
  }
}

export function increaseItem(state: OrderState, productId: string): OrderState {
  const line = state.cart.find((item) => item.productId === productId);
  if (!line) {
    return { ...state, notice: 'Esse item não está no pedido.' };
  }
  try {
    return {
      ...state,
      cart: changeQuantity(state.cart, productId, line.quantity + 1),
      notice: null,
      receipt: null,
    };
  } catch (error) {
    return { ...state, notice: textFrom(error) };
  }
}

export function decreaseItem(state: OrderState, productId: string): OrderState {
  const line = state.cart.find((item) => item.productId === productId);
  if (!line) {
    return { ...state, notice: 'Esse item não está no pedido.' };
  }
  return {
    ...state,
    cart: changeQuantity(state.cart, productId, line.quantity - 1),
    notice: null,
    receipt: null,
  };
}

export function removeItem(state: OrderState, productId: string): OrderState {
  return { ...state, cart: removeProduct(state.cart, productId), notice: null, receipt: null };
}

export function editQuery(state: OrderState, query: string): OrderState {
  return { ...state, query };
}

export function editCoupon(state: OrderState, couponInput: string): OrderState {
  return { ...state, couponInput };
}

export function editPaid(state: OrderState, paidInput: string): OrderState {
  return { ...state, paidInput };
}

export function chooseCategory(state: OrderState, category: string): OrderState {
  if (!isCatalogFilter(category)) {
    return { ...state, notice: 'Categoria desconhecida.' };
  }
  return { ...state, category, notice: null };
}

export function chooseMethod(state: OrderState, method: string): OrderState {
  if (!isPaymentMethod(method)) {
    return { ...state, notice: 'Escolha dinheiro, pix ou cartão.' };
  }
  if (method === state.method) {
    return state;
  }
  return { ...state, method, notice: null, receipt: null };
}

export function applyCoupon(state: OrderState): OrderState {
  if (!state.couponInput.trim()) {
    return { ...state, appliedCoupon: '', couponInput: '', notice: 'Cupom removido.', receipt: null };
  }

  const coupon = findCoupon(state.couponInput);
  if (!coupon) {
    return { ...state, notice: 'Esse cupom não existe.' };
  }

  return {
    ...state,
    appliedCoupon: coupon.code,
    couponInput: coupon.code,
    notice: `Cupom ${coupon.code} aplicado.`,
    receipt: null,
  };
}

export function pay(state: OrderState): OrderState {
  if (state.cart.length === 0) {
    return { ...state, receipt: null, notice: 'Adicione um item antes de fechar a conta.' };
  }

  const quote = previewOrder(state.cart, state.appliedCoupon);
  if (quote.couponMessage) {
    return { ...state, receipt: null, notice: quote.couponMessage };
  }

  let amountCents = quote.totalCents;
  if (state.method === 'dinheiro') {
    try {
      amountCents = parseReaisToCents(state.paidInput);
    } catch (error) {
      return { ...state, receipt: null, notice: textFrom(error) };
    }
  }

  const result = closeOrder(state.cart, state.appliedCoupon, {
    method: state.method,
    amountCents,
  });
  if (!result.ok) {
    return { ...state, receipt: null, notice: result.message };
  }
  return { ...state, notice: null, receipt: result.receipt };
}
