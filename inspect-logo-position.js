import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);

  // Get logo element and its position
  const logoInfo = await page.evaluate(() => {
    const logoContainer = document.querySelector('header img[alt="Nala\'s Baby Logo"]')?.parentElement;
    if (!logoContainer) return { error: 'Logo not found' };

    const rect = logoContainer.getBoundingClientRect();
    const styles = window.getComputedStyle(logoContainer);

    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      computedTop: styles.top,
      computedLeft: styles.left,
      position: styles.position,
      transform: styles.transform,
      classes: logoContainer.className
    };
  });

  console.log('Logo Position Info:', JSON.stringify(logoInfo, null, 2));

  // Get header info
  const headerInfo = await page.evaluate(() => {
    const header = document.querySelector('header');
    if (!header) return { error: 'Header not found' };

    const rect = header.getBoundingClientRect();
    const styles = window.getComputedStyle(header);

    return {
      top: rect.top,
      padding: styles.padding,
      paddingTop: styles.paddingTop,
      position: styles.position
    };
  });

  console.log('Header Info:', JSON.stringify(headerInfo, null, 2));

  await page.waitForTimeout(5000);
  await browser.close();
})();
