import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5173/contact');
  await page.waitForTimeout(3000); // Wait longer for all styles to load

  // Check if Tailwind classes are present
  const inputClasses = await page.locator('input').first().getAttribute('class');
  console.log('\n=== INPUT CLASSES ===');
  console.log(inputClasses);

  const buttonClasses = await page.locator('button').first().getAttribute('class');
  console.log('\n=== BUTTON CLASSES ===');
  console.log(buttonClasses);

  const labelClasses = await page.locator('label').first().getAttribute('class');
  console.log('\n=== LABEL CLASSES ===');
  console.log(labelClasses);

  const containerClasses = await page.locator('.bg-white\\/30').first().getAttribute('class');
  console.log('\n=== CONTAINER CLASSES ===');
  console.log(containerClasses);

  // Get actual visual dimensions
  const inputBox = await page.locator('input').first().boundingBox();
  console.log('\n=== INPUT VISUAL DIMENSIONS ===');
  console.log(inputBox);

  const buttonBox = await page.locator('button').first().boundingBox();
  console.log('\n=== BUTTON VISUAL DIMENSIONS ===');
  console.log(buttonBox);

  // Take full page screenshot
  await page.screenshot({ path: 'full-contact-page.png', fullPage: true });
  console.log('\n✅ Full page screenshot saved');

  await browser.close();
})();
