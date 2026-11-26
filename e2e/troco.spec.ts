import { expect, test } from '@playwright/test';

test('calcula o troco no pagamento em dinheiro', async ({ page }) => {
  await page.route('**/api/orders', async (route) => {
    const data = route.request().postDataJSON() as { amountCents: number };
    expect(data.amountCents).toBe(1000);
    await route.fulfill({ status: 404, body: '' });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Adicionar Pão francês' }).click();
  await page.getByRole('button', { name: 'Aumentar Pão francês' }).click();
  await page.getByLabel('Valor recebido').fill('10,00');
  await page.getByRole('button', { name: 'Fechar conta' }).click();
  const receipt = page.getByRole('region', { name: 'Comprovante' });
  await expect(receipt).toContainText('Troco');
  await expect(receipt).toContainText('7,00');
});
