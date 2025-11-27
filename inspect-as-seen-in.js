import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();

  // Desktop viewport
  console.log('=== DESKTOP VIEWPORT ===\n');
  const desktopPage = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await desktopPage.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(2000);

  // Find "As seen in" text
  const asSeenInElements = await desktopPage.locator('text=/As seen in/i').all();
  console.log(`Found ${asSeenInElements.length} "As seen in" elements\n`);

  for (let i = 0; i < asSeenInElements.length; i++) {
    const element = asSeenInElements[i];
    const box = await element.boundingBox();
    const text = await element.textContent();

    // Get parent container info
    const parent = await element.evaluateHandle(el => el.parentElement);
    const parentBox = await parent.asElement().boundingBox();
    const parentStyles = await parent.asElement().evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        marginLeft: styles.marginLeft,
        marginRight: styles.marginRight,
        textAlign: styles.textAlign,
        display: styles.display,
        className: el.className
      };
    });

    const elementStyles = await element.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        marginLeft: styles.marginLeft,
        marginRight: styles.marginRight,
        textAlign: styles.textAlign,
        className: el.className
      };
    });

    console.log(`Element ${i + 1}:`);
    console.log(`  Text: "${text?.trim()}"`);
    console.log(`  Position: x=${box?.x}, y=${box?.y}`);
    console.log(`  Size: width=${box?.width}, height=${box?.height}`);
    console.log(`  Distance from left edge: ${box?.x}px`);
    console.log(`  Distance from right edge: ${1920 - (box?.x + box?.width)}px`);
    console.log(`  Element styles:`, elementStyles);
    console.log(`  Parent box:`, parentBox);
    console.log(`  Parent styles:`, parentStyles);
    console.log('');
  }

  await desktopPage.screenshot({ path: 'as-seen-in-desktop.png', fullPage: true });
  console.log('Desktop screenshot saved to as-seen-in-desktop.png\n');

  // Mobile viewport
  console.log('=== MOBILE VIEWPORT (iPhone 12) ===\n');
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 }
  });

  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);

  const mobileAsSeenInElements = await mobilePage.locator('text=/As seen in/i').all();
  console.log(`Found ${mobileAsSeenInElements.length} "As seen in" elements\n`);

  for (let i = 0; i < mobileAsSeenInElements.length; i++) {
    const element = mobileAsSeenInElements[i];
    const box = await element.boundingBox();
    const text = await element.textContent();

    const parent = await element.evaluateHandle(el => el.parentElement);
    const parentBox = await parent.asElement().boundingBox();
    const parentStyles = await parent.asElement().evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        marginLeft: styles.marginLeft,
        marginRight: styles.marginRight,
        textAlign: styles.textAlign,
        display: styles.display,
        className: el.className
      };
    });

    const elementStyles = await element.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        marginLeft: styles.marginLeft,
        marginRight: styles.marginRight,
        textAlign: styles.textAlign,
        className: el.className
      };
    });

    console.log(`Element ${i + 1}:`);
    console.log(`  Text: "${text?.trim()}"`);
    console.log(`  Position: x=${box?.x}, y=${box?.y}`);
    console.log(`  Size: width=${box?.width}, height=${box?.height}`);
    console.log(`  Distance from left edge: ${box?.x}px`);
    console.log(`  Distance from right edge: ${390 - (box?.x + box?.width)}px`);
    console.log(`  Is centered: ${Math.abs((box?.x + box?.width / 2) - 195) < 10 ? 'YES' : 'NO'}`);
    console.log(`  Element styles:`, elementStyles);
    console.log(`  Parent box:`, parentBox);
    console.log(`  Parent styles:`, parentStyles);
    console.log('');
  }

  await mobilePage.screenshot({ path: 'as-seen-in-mobile.png', fullPage: true });
  console.log('Mobile screenshot saved to as-seen-in-mobile.png\n');

  await browser.close();
})();
