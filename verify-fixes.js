import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5173/contact');
  await page.waitForTimeout(2000);

  console.log('\n========================================');
  console.log('CLOUDWATCH FORM - VERIFICATION AUDIT');
  console.log('========================================\n');

  // 1. FORM CONTAINER MEASUREMENTS
  const containerStyles = await page.locator('.bg-white\\/30.backdrop-blur-md').first().evaluate((el) => {
    const computed = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      padding: computed.padding,
      gap: computed.gap,
      borderRadius: computed.borderRadius,
    };
  });

  console.log('=== FORM CONTAINER (AFTER FIXES) ===');
  console.log(JSON.stringify(containerStyles, null, 2));

  // 2. LABEL MEASUREMENTS
  const labelStyles = await page.locator('label').first().evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      color: computed.color,
      marginBottom: computed.marginBottom,
    };
  });

  console.log('\n=== LABEL STYLES (AFTER FIXES) ===');
  console.log(JSON.stringify(labelStyles, null, 2));

  // 3. INPUT FIELD MEASUREMENTS
  const inputStyles = await page.locator('input').first().evaluate((el) => {
    const computed = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      padding: computed.padding,
      borderWidth: computed.borderWidth,
      borderRadius: computed.borderRadius,
      fontSize: computed.fontSize,
    };
  });

  console.log('\n=== INPUT FIELDS (AFTER FIXES) ===');
  console.log(JSON.stringify(inputStyles, null, 2));

  // 4. BUTTON MEASUREMENTS
  const buttonStyles = await page.locator('button').first().evaluate((el) => {
    const computed = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      padding: computed.padding,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      borderRadius: computed.borderRadius,
      backgroundColor: computed.backgroundColor,
      color: computed.color,
    };
  });

  console.log('\n=== SUBMIT BUTTON (AFTER FIXES) ===');
  console.log(JSON.stringify(buttonStyles, null, 2));

  // 5. TAKE UPDATED SCREENSHOTS
  const formContainer = await page.locator('.bg-white\\/30').first();
  await formContainer.screenshot({ path: 'audit-fixed-state.png' });
  console.log('\n✅ Updated screenshot saved as audit-fixed-state.png');

  await page.locator('input').first().screenshot({ path: 'audit-fixed-input.png' });
  console.log('✅ Updated input screenshot saved as audit-fixed-input.png');

  await page.locator('button').first().screenshot({ path: 'audit-fixed-button.png' });
  console.log('✅ Updated button screenshot saved as audit-fixed-button.png');

  console.log('\n========================================');
  console.log('VERIFICATION COMPLETE');
  console.log('========================================\n');

  await browser.close();
})();
