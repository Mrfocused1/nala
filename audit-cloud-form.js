import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5173/contact');
  await page.waitForTimeout(2000);

  console.log('\n========================================');
  console.log('CLOUDWATCH FORM - COMPREHENSIVE UI AUDIT');
  console.log('========================================\n');

  // 1. FORM CONTAINER MEASUREMENTS
  const containerStyles = await page.locator('.bg-white\\/30.backdrop-blur-md').first().evaluate((el) => {
    const computed = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      padding: computed.padding,
      paddingTop: computed.paddingTop,
      paddingRight: computed.paddingRight,
      paddingBottom: computed.paddingBottom,
      paddingLeft: computed.paddingLeft,
      gap: computed.gap,
      borderRadius: computed.borderRadius,
      backgroundColor: computed.backgroundColor,
      backdropFilter: computed.backdropFilter,
    };
  });

  console.log('=== FORM CONTAINER ===');
  console.log(JSON.stringify(containerStyles, null, 2));

  // 2. CLOUD IMAGE MEASUREMENTS
  const cloudStyles = await page.locator('img[alt="cartoon"]').evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const parent = el.parentElement;
    const parentComputed = window.getComputedStyle(parent);
    return {
      imageWidth: rect.width,
      imageHeight: rect.height,
      parentWidth: parentComputed.width,
      parentHeight: parentComputed.height,
      marginBottom: parentComputed.marginBottom,
    };
  });

  console.log('\n=== CLOUD IMAGE ===');
  console.log(JSON.stringify(cloudStyles, null, 2));

  // 3. LABEL MEASUREMENTS
  const labelStyles = await page.locator('label').first().evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      color: computed.color,
      marginBottom: computed.marginBottom,
      lineHeight: computed.lineHeight,
      display: computed.display,
    };
  });

  console.log('\n=== LABEL STYLES ===');
  console.log(JSON.stringify(labelStyles, null, 2));

  // 4. INPUT FIELD MEASUREMENTS
  const inputStyles = await page.locator('input').first().evaluate((el) => {
    const computed = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      padding: computed.padding,
      paddingTop: computed.paddingTop,
      paddingRight: computed.paddingRight,
      paddingBottom: computed.paddingBottom,
      paddingLeft: computed.paddingLeft,
      border: computed.border,
      borderWidth: computed.borderWidth,
      borderColor: computed.borderColor,
      borderRadius: computed.borderRadius,
      fontSize: computed.fontSize,
      lineHeight: computed.lineHeight,
      backgroundColor: computed.backgroundColor,
    };
  });

  console.log('\n=== INPUT FIELDS ===');
  console.log(JSON.stringify(inputStyles, null, 2));

  // 5. FIELD GROUP SPACING
  const fieldGroupStyles = await page.locator('.flex.flex-col').first().evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      display: computed.display,
      flexDirection: computed.flexDirection,
      gap: computed.gap,
      marginBottom: computed.marginBottom,
    };
  });

  console.log('\n=== FIELD GROUP (Name, Email, etc.) ===');
  console.log(JSON.stringify(fieldGroupStyles, null, 2));

  // 6. FORM FIELDS CONTAINER SPACING
  const formFieldsContainerStyles = await page.locator('.w-full.flex.flex-col.gap-6').first().evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      gap: computed.gap,
      width: computed.width,
    };
  });

  console.log('\n=== FORM FIELDS CONTAINER ===');
  console.log(JSON.stringify(formFieldsContainerStyles, null, 2));

  // 7. BUTTON MEASUREMENTS
  const buttonStyles = await page.locator('button').first().evaluate((el) => {
    const computed = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      padding: computed.padding,
      paddingTop: computed.paddingTop,
      paddingBottom: computed.paddingBottom,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      borderRadius: computed.borderRadius,
      backgroundColor: computed.backgroundColor,
      color: computed.color,
      marginTop: computed.marginTop,
    };
  });

  console.log('\n=== SUBMIT BUTTON ===');
  console.log(JSON.stringify(buttonStyles, null, 2));

  // 8. TAKE FULL FORM SCREENSHOT
  const formContainer = await page.locator('.bg-white\\/30').first();
  await formContainer.screenshot({ path: 'audit-current-state.png' });
  console.log('\n✅ Screenshot saved as audit-current-state.png');

  // 9. TAKE SCREENSHOTS OF INDIVIDUAL ELEMENTS
  await page.locator('input').first().screenshot({ path: 'audit-input-field.png' });
  console.log('✅ Input field screenshot saved as audit-input-field.png');

  await page.locator('button').first().screenshot({ path: 'audit-button.png' });
  console.log('✅ Button screenshot saved as audit-button.png');

  console.log('\n========================================');
  console.log('AUDIT COMPLETE');
  console.log('========================================\n');

  await browser.close();
})();
