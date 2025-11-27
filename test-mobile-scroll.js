import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });

  // Create mobile context
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }, // iPhone SE size
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });

  const page = await context.newPage();

  console.log('📱 Testing Mobile Browse Collection Scroll\n');

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);

  // Scroll to Browse Collection
  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h =>
      h.textContent.includes('Browse') && h.textContent.includes('Collection')
    );
    if (heading) heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  await page.waitForTimeout(2000);

  console.log('Starting scroll test...\n');

  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy(0, 50));
    await page.waitForTimeout(200);

    const info = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[class*="group"][class*="relative"]')).filter(card => {
        const img = card.querySelector('img');
        return img && img.alt && !img.alt.includes('Logo');
      });

      const visible = cards.map((card, idx) => {
        const rect = card.getBoundingClientRect();
        const img = card.querySelector('img');
        const isVisible = rect.right > 0 && rect.left < window.innerWidth;
        return {
          index: idx + 1,
          name: img?.alt,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          visible: isVisible
        };
      }).filter(c => c.visible);

      const container = document.querySelector('[class*="relative"][class*="h-screen"]');
      const isPinned = container && window.getComputedStyle(container).position === 'fixed';

      return {
        visible,
        isPinned,
        viewportWidth: window.innerWidth
      };
    });

    const names = info.visible.map(c => `#${c.index}`).join(', ');
    const status = info.isPinned ? '(PINNED)' : '(scrolling)';
    console.log(`Scroll ${i}: ${names || 'NONE'} ${status}`);

    if (!info.isPinned && info.visible.length === 0) {
      console.log(`\n⚠️  Section unpinned at scroll ${i} with no cards visible!`);
      break;
    }
  }

  await page.waitForTimeout(3000);
  await browser.close();
})();
