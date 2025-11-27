import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Check the computed styles on the container
  const styles = await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(el =>
      el.textContent.includes('As') && el.textContent.includes('seen')
    );

    if (!h2) return { error: 'Element not found' };

    // Get the container with px-4 md:px-8
    let container = h2.parentElement;
    while (container && !container.className.includes('px-4')) {
      container = container.parentElement;
    }

    if (!container) return { error: 'Container not found' };

    const computedStyles = window.getComputedStyle(container);
    const box = container.getBoundingClientRect();

    return {
      className: container.className,
      paddingLeft: computedStyles.paddingLeft,
      paddingRight: computedStyles.paddingRight,
      marginLeft: computedStyles.marginLeft,
      marginRight: computedStyles.marginRight,
      boxX: box.x,
      boxWidth: box.width,
      viewportWidth: window.innerWidth,
      expectedCenterX: (window.innerWidth - box.width) / 2
    };
  });

  console.log('Container Analysis:');
  console.log(JSON.stringify(styles, null, 2));

  await browser.close();
})();
