import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll to the footer
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await page.waitForTimeout(2000);

  // Check if footer exists and has physics items
  const footerInfo = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return { error: 'Footer not found' };

    const instructionText = footer.querySelector('p');
    const footerItems = footer.querySelectorAll('[style*="opacity"]');
    const copyrightText = footer.textContent.includes('Nala\'s Baby');
    const bgColor = window.getComputedStyle(footer).backgroundColor;

    return {
      found: true,
      hasInstructionText: !!instructionText,
      instructionContent: instructionText?.textContent,
      itemCount: footerItems.length,
      hasCopyright: copyrightText,
      backgroundColor: bgColor,
      footerHeight: footer.clientHeight
    };
  });

  console.log('\n=== PHYSICS FOOTER CHECK ===\n');
  console.log('Footer info:', JSON.stringify(footerInfo, null, 2));
  console.log('\n✓ Footer exists:', footerInfo.found);
  console.log('✓ Has instruction text:', footerInfo.hasInstructionText);
  console.log('✓ Number of physics items:', footerInfo.itemCount);
  console.log('✓ Has copyright:', footerInfo.hasCopyright);
  console.log('✓ Background color:', footerInfo.backgroundColor);

  // Hover over footer to trigger physics
  await page.hover('footer');
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'footer-check.png', fullPage: true });
  console.log('\nScreenshot saved to footer-check.png\n');

  await browser.close();
})();
