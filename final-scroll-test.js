import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();

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

  console.log('📏 Testing Scroll Behavior\n');

  for (let i = 0; i < 12; i++) {
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(300);

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

      const isPinned = document.querySelector('[class*="pin-spacer"]') !== null;

      return {
        visible,
        isPinned,
        scrollY: window.scrollY
      };
    });

    const names = info.visible.map(c => `#${c.index}`).join(', ');
    console.log(`Scroll ${i}: ${names || 'NONE VISIBLE'} ${info.isPinned ? '(pinned)' : ''}`);

    if (info.visible.length === 0 && !info.isPinned) {
      console.log(`\n✅ Section unpinned at scroll ${i} - this is where it should stop!`);
      break;
    }
  }

  await page.waitForTimeout(2000);
  await browser.close();
})();
