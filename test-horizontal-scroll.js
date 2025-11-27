import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  await page.goto('http://localhost:5173');
  console.log('✅ Loaded home page');

  // Scroll to Browse Collection section
  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h =>
      h.textContent.includes('Browse') && h.textContent.includes('Collection')
    );
    if (heading) {
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  await page.waitForTimeout(2000);

  console.log('\n🔄 Starting horizontal scroll test...\n');

  // Scroll down slowly to trigger horizontal product scroll
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollBy(0, 50));
    await page.waitForTimeout(300);

    const visibleCard = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[class*="group"][class*="relative"]')).filter(card => {
        const img = card.querySelector('img');
        return img && img.alt && !img.alt.includes('Logo');
      });

      return cards.map(card => {
        const rect = card.getBoundingClientRect();
        const img = card.querySelector('img');
        return {
          alt: img?.alt,
          x: Math.round(rect.x),
          visible: rect.x > 0 && rect.x < window.innerWidth
        };
      }).filter(c => c.visible);
    });

    if (visibleCard.length > 0) {
      console.log(`Scroll ${i}: ${visibleCard.map(c => `${c.alt} (x:${c.x})`).join(', ')}`);
    }
  }

  console.log('\n✅ Horizontal scroll test complete!\n');
  console.log('All 4 products should have scrolled through the viewport.');

  await page.waitForTimeout(3000);
  await browser.close();
})();
