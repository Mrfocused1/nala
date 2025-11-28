import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Scroll to the journey section
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 5);
    });

    await page.waitForTimeout(2000);

    console.log('=== JOURNEY STAGES CHECK ===\n');

    // Check all journey stages
    const stages = [
      'Natural Ingredients',
      'Sensitive Skin Safe',
      'Award-Winning Care',
      'Made in Britain'
    ];

    for (const stage of stages) {
      const textFound = await page.locator(`text=${stage.split(' ')[0]}`).count();
      console.log(`${stage}:`, textFound > 0 ? '✓' : '✗');
    }

    // Count all image containers
    const totalImages = await page.locator('div.rounded-xl.border-2.border-white').count();
    console.log(`\nTotal image containers: ${totalImages}`);
    console.log(`Expected: 8 (2 per stage × 4 stages)`);

    // Take screenshot
    await page.screenshot({ path: 'all-stages-check.png', fullPage: true });
    console.log('\nScreenshot saved: all-stages-check.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
