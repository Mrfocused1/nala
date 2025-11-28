import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Scroll to the Natural Ingredients section
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 4); // Scroll down to reach journey section
    });

    await page.waitForTimeout(2000);

    // Check for the Natural Ingredients section
    const naturalIngredientsSection = await page.locator('text=Natural Ingredients').count();
    console.log('=== NATURAL INGREDIENTS SECTION CHECK ===');
    console.log('Natural Ingredients text found:', naturalIngredientsSection > 0);

    // Check for image containers
    const imageContainers = await page.locator('div.rounded-xl.border-2.border-white').count();
    console.log('Image containers with rounded edges and white border:', imageContainers);

    // Check for images
    const images = await page.locator('div.rounded-xl.border-2.border-white img').count();
    console.log('Images inside containers:', images);

    if (images > 0) {
      // Get image sources
      const imageSrcs = await page.locator('div.rounded-xl.border-2.border-white img').evaluateAll(imgs =>
        imgs.map(img => img.src)
      );
      console.log('Image sources:', imageSrcs);

      // Check if images are visible
      const firstImageVisible = await page.locator('div.rounded-xl.border-2.border-white').first().isVisible();
      console.log('First image container visible:', firstImageVisible);

      // Check if they're side by side
      const containerLayout = await page.locator('div.rounded-xl.border-2.border-white').first().evaluate(el => {
        const parent = el.parentElement;
        return {
          parentFlexDirection: window.getComputedStyle(parent).flexDirection
        };
      });
      console.log('Container layout (should be row for side-by-side):', containerLayout.parentFlexDirection);
    }

    // Take screenshot
    await page.screenshot({ path: 'natural-ingredients-check.png', fullPage: true });
    console.log('\nScreenshot saved: natural-ingredients-check.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
