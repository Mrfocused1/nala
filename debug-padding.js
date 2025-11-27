import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll to the "As seen in" section
  await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    const element = elements.find(el => el.textContent.includes('As seen'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  await page.waitForTimeout(1000);

  // Find the parent containers and check their padding
  const info = await page.evaluate(() => {
    const asSeenElement = Array.from(document.querySelectorAll('h2')).find(el =>
      el.textContent.includes('As') && el.textContent.includes('seen')
    );

    if (!asSeenElement) return { error: 'Element not found' };

    const results = [];
    let current = asSeenElement;
    let level = 0;

    // Walk up the DOM tree
    while (current && level < 10) {
      const box = current.getBoundingClientRect();
      const styles = window.getComputedStyle(current);

      results.push({
        level,
        tagName: current.tagName,
        className: current.className,
        x: box.x,
        width: box.width,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        marginLeft: styles.marginLeft,
        marginRight: styles.marginRight,
      });

      current = current.parentElement;
      level++;
    }

    return results;
  });

  console.log('DOM Tree Analysis (from "As seen" element upwards):\n');
  info.forEach(item => {
    console.log(`Level ${item.level}: ${item.tagName} (${item.className})`);
    console.log(`  Position: x=${item.x}, width=${item.width}`);
    console.log(`  Padding: left=${item.paddingLeft}, right=${item.paddingRight}`);
    console.log(`  Margin: left=${item.marginLeft}, right=${item.marginRight}`);
    console.log('');
  });

  await browser.close();
})();
