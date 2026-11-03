import { expect, test } from '@playwright/test';

test('inclui o pão francês no pedido', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Adicionar Pão francês' }).click();
  await expect(page.locator('#qtd-pao-frances')).toHaveText('1');
  await expect(page.locator('#total')).toContainText('1,50');
});
