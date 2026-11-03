import { expect, test } from '@playwright/test';

test('mostra os produtos e o pedido vazio ao abrir o balcão', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Balcão de pedidos' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Adicionar Pão francês' })).toBeVisible();
  await expect(page.getByText('Nenhum item no pedido.')).toBeVisible();
});
