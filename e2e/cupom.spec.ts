import { expect, test } from '@playwright/test';

test('aplica o cupom de dez por cento', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Adicionar Coxinha' }).click();
  await page.getByLabel('Cupom').fill('AURORA10');
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();
  await expect(page.locator('#desconto')).toContainText('0,90');
  await expect(page.locator('#total')).toContainText('8,10');
});
