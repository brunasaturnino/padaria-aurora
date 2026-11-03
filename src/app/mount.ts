import {
  addItem,
  applyCoupon,
  chooseCategory,
  chooseMethod,
  createOrder,
  decreaseItem,
  editCoupon,
  editPaid,
  editQuery,
  increaseItem,
  pay,
  removeItem,
  type OrderState,
} from './order';
import { renderBalcao } from './render';

function readInputs(root: HTMLElement, state: OrderState): OrderState {
  const coupon = root.querySelector<HTMLInputElement>('#cupom');
  const paid = root.querySelector<HTMLInputElement>('#recebido');
  const method = root.querySelector<HTMLSelectElement>('#pagamento');
  let next = state;
  if (coupon) next = editCoupon(next, coupon.value);
  if (paid) next = editPaid(next, paid.value);
  if (method) next = chooseMethod(next, method.value);
  return next;
}

function applyAction(state: OrderState, action: string, productId: string, category: string): OrderState {
  if (action === 'add') return addItem(state, productId);
  if (action === 'increase') return increaseItem(state, productId);
  if (action === 'decrease') return decreaseItem(state, productId);
  if (action === 'remove') return removeItem(state, productId);
  if (action === 'apply-coupon') return applyCoupon(state);
  if (action === 'pay') return pay(state);
  if (action === 'category') return chooseCategory(state, category);
  return state;
}

export function mountBalcao(root: HTMLElement): void {
  let state = createOrder();

  const draw = () => {
    root.innerHTML = renderBalcao(state);
  };

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const control = target.closest<HTMLElement>('[data-action]');
    if (!control || !root.contains(control)) return;
    state = readInputs(root, state);
    state = applyAction(state, control.dataset.action ?? '', control.dataset.product ?? '', control.dataset.category ?? '');
    draw();
  });

  root.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement) || target.id !== 'pagamento') return;
    state = readInputs(root, state);
    draw();
  });

  root.addEventListener('keydown', (event) => {
    if (!(event.target instanceof HTMLInputElement) || event.key !== 'Enter') return;
    event.preventDefault();
    state = readInputs(root, state);
    if (event.target.id === 'cupom') state = applyCoupon(state);
    else if (event.target.id === 'recebido') state = pay(state);
    else return;
    draw();
  });

  root.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.id !== 'busca') return;
    const cursor = target.selectionStart;
    state = readInputs(root, state);
    state = editQuery(state, target.value);
    draw();
    const field = root.querySelector<HTMLInputElement>('#busca');
    field?.focus();
    if (field && cursor !== null) field.setSelectionRange(cursor, cursor);
  });

  draw();
}

export function startBalcao(doc: Document = document): void {
  const root = doc.querySelector<HTMLElement>('#app');
  if (!root) {
    throw new Error('Não encontrei a área do balcão.');
  }
  mountBalcao(root);
}
