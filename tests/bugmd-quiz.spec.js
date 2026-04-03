const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://bugmd-4.myshopify.com';
const STORE_URL = `${BASE_URL}/pages/get-started`;
const STORE_PASSWORD = 'cranberry';

async function unlockStore(page) {
  await page.goto(`${BASE_URL}/password`);
  await page.waitForLoadState('domcontentloaded');

  const details = page.locator('details');
  if (await details.count()) {
    await details.first().click();
  }

  const passwordInput = page.locator('input[name="password"]');
  await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
  await passwordInput.fill(STORE_PASSWORD);
  await passwordInput.press('Enter');

  await page.waitForLoadState('networkidle');
}

test.beforeEach(async ({ page }) => {
  await unlockStore(page);
  await page.goto(STORE_URL);
  await page.waitForSelector('.bq-hero', { timeout: 15000 });
});

test('annual plan adds correct product to cart', async ({ page }) => {
  await page.locator('.bq-btn').first().click();
  await page.waitForSelector('#bqs1.bq-active');

  await page.locator('#bqZip').fill('92688');
  await page.locator('#bqs1 .bq-btn').click();

  await page.waitForSelector('#bqs2.bq-active');
  await page.locator('#bqs2 .bq-option').nth(1).click();

  await page.waitForSelector('#bqs3.bq-active');
  await page.locator('#bqs3 .bq-pest').first().click();
  await page.locator('#bqs3 .bq-btn').click();

  await page.waitForSelector('#bqs4.bq-active');
  await expect(page.locator('#bqPlanAnnual')).toHaveClass(/bq-sel/);

  await page.locator('#bqs4 .bq-btn').last().click();
  await page.waitForSelector('#bqs5.bq-active');

  await expect(page.locator('#bqRvProduct')).toContainText(/Annual Kit/i);
  await expect(page.locator('#bqRvTotal')).toHaveText('$140.00');

  await page.locator('#bqs5 .bq-btn').click();

  await expect(page).toHaveURL(/\/cart|\/checkouts/);
});

test('quarterly plan shows correct price and adds to cart', async ({ page }) => {
  await page.locator('.bq-btn').first().click();
  await page.waitForSelector('#bqs1.bq-active');

  await page.locator('#bqZip').fill('90210');
  await page.locator('#bqs1 .bq-btn').click();

  await page.waitForSelector('#bqs2.bq-active');
  await page.locator('#bqs2 .bq-option').first().click();

  await page.waitForSelector('#bqs3.bq-active');
  await page.locator('#bqs3 .bq-pest').first().click();
  await page.locator('#bqs3 .bq-btn').click();

  await page.waitForSelector('#bqs4.bq-active');
  await page.locator('#bqPlanQuarterly').click();

  await expect(page.locator('#bqPlanQuarterly')).toHaveClass(/bq-sel/);
  await expect(page.locator('#bqStickyPrice')).toContainText('$45');

  await page.locator('#bqs4 .bq-btn').last().click();
  await page.waitForSelector('#bqs5.bq-active');

  await expect(page.locator('#bqRvTotal')).toHaveText('$45.00');

  await page.locator('#bqs5 .bq-btn').click();

  await expect(page).toHaveURL(/\/cart|\/checkouts/);
});

test('invalid ZIP shows validation error', async ({ page }) => {
  await page.locator('.bq-btn').first().click();
  await page.waitForSelector('#bqs1.bq-active');

  await page.locator('#bqs1 .bq-btn').click();
  await expect(page.locator('#bqZipErr')).toBeVisible();

  await page.locator('#bqZip').fill('123');
  await page.locator('#bqs1 .bq-btn').click();
  await expect(page.locator('#bqZipErr')).toBeVisible();
});