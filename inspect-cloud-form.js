import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5173/contact');
  await page.waitForTimeout(2000);

  // Take screenshot of the form
  const formContainer = await page.locator('.bg-white\\/30').first();
  await formContainer.screenshot({ path: 'current-cloud-form.png' });

  // Get computed styles and dimensions
  const styles = await formContainer.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    return {
      width: rect.width,
      height: rect.height,
      padding: computed.padding,
      gap: computed.gap,
      display: computed.display,
      flexDirection: computed.flexDirection,
    };
  });

  console.log('\n=== FORM CONTAINER STYLES ===');
  console.log(JSON.stringify(styles, null, 2));

  // Get cloud image dimensions
  const cloudImage = await page.locator('img[alt="cartoon"]');
  const cloudStyles = await cloudImage.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
    };
  });

  console.log('\n=== CLOUD IMAGE DIMENSIONS ===');
  console.log(JSON.stringify(cloudStyles, null, 2));

  // Get form fields container styles
  const formFields = await page.locator('.w-full.flex.flex-col.gap-6').first();
  const fieldStyles = await formFields.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      gap: computed.gap,
      marginTop: computed.marginTop,
    };
  });

  console.log('\n=== FORM FIELDS STYLES ===');
  console.log(JSON.stringify(fieldStyles, null, 2));

  // Get individual field spacing
  const firstField = await page.locator('.flex.flex-col').first();
  const fieldItemStyles = await firstField.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      marginBottom: computed.marginBottom,
    };
  });

  console.log('\n=== INDIVIDUAL FIELD STYLES ===');
  console.log(JSON.stringify(fieldItemStyles, null, 2));

  // Check label styles
  const label = await page.locator('label').first();
  const labelStyles = await label.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      marginBottom: computed.marginBottom,
      fontSize: computed.fontSize,
    };
  });

  console.log('\n=== LABEL STYLES ===');
  console.log(JSON.stringify(labelStyles, null, 2));

  console.log('\n✅ Screenshot saved as current-cloud-form.png');

  await browser.close();
})();
