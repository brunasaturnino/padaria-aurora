import { expect, test } from '@playwright/test';

test('aumenta a quantidade do item no pedido', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Adicionar Pão francês' }).click();
  await page.getByRole('button', { name: 'Aumentar Pão francês' }).click();
  await expect(page.locator('#qtd-pao-frances')).toHaveText('2');
  await expect(page.locator('#total')).toContainText('3,00');
});
