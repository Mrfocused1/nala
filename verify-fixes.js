import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Verifying fixes...\n');

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);

  // Scroll to Browse Collection
  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h =>
      h.textContent.includes('Browse') && h.textContent.includes('Collection')
    );
    if (heading) heading.scrollIntoView({ behavior: 'smooth' });
  });

  await page.waitForTimeout(2000);

  console.log('📦 CHECK 1: Product Image Uniqueness\n');

  const products = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[class*="group"][class*="relative"]')).filter(card => {
      const img = card.querySelector('img');
      return img && img.alt && !img.alt.includes('Logo');
    });

    return cards.map(card => {
      const img = card.querySelector('img');
      return {
        alt: img?.alt,
        width: img?.naturalWidth,
        height: img?.naturalHeight,
        src: img?.src.substring(img?.src.lastIndexOf('/'))
      };
    });
  });

  products.forEach((p, i) => {
    console.log(`Product ${i + 1}: ${p.width}x${p.height}px - ${p.src}`);
  });

  const uniqueSizes = new Set(products.map(p => `${p.width}x${p.height}`));
  if (uniqueSizes.size >= 3) {
    console.log(`\n✅ PASS: ${uniqueSizes.size} different image sizes detected`);
  } else {
    console.log(`\n⚠️  WARNING: Only ${uniqueSizes.size} unique sizes`);
  }

  console.log('\n📏 CHECK 2: Scroll Distance\n');

  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h =>
      h.textContent.includes('Browse') && h.textContent.includes('Collection')
    );
    if (heading) heading.scrollIntoView({ behavior: 'auto', block: 'start' });
  });

  await page.waitForTimeout(1000);

  let lastCardVisible = true;
  let scrollsAfterLastCard = 0;
  let totalScrolls = 0;

  for (let i = 0; i < 15; i++) {
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(200);
    totalScrolls++;

    const scrollInfo = await page.evaluate(() => {
      const track = document.querySelector('[class*="flex"][class*="gap"]');
      if (!track) return null;

      const cards = Array.from(track.children).filter(c => c.querySelector('img'));
      const lastCard = cards[cards.length - 1];
      const lastCardRect = lastCard?.getBoundingClientRect();

      return {
        lastCardRight: Math.round(lastCardRect?.right || 0),
        viewportWidth: window.innerWidth
      };
    });

    if (scrollInfo) {
      const visible = scrollInfo.lastCardRight > 50; // 50px buffer

      if (visible) {
        console.log(`Scroll ${i}: Last card at ${scrollInfo.lastCardRight}px ✓`);
      } else if (lastCardVisible) {
        console.log(`Scroll ${i}: Last card exited viewport at ${scrollInfo.lastCardRight}px`);
        lastCardVisible = false;
      } else {
        scrollsAfterLastCard++;
      }
    }
  }

  console.log(`\nTotal scrolls: ${totalScrolls}`);
  console.log(`Scrolls after last card left: ${scrollsAfterLastCard}`);

  if (scrollsAfterLastCard <= 2) {
    console.log('\n✅ PASS: Scroll distance is appropriate (≤2 extra scrolls)');
  } else {
    console.log(`\n⚠️  WARNING: ${scrollsAfterLastCard} extra scrolls after last card`);
  }

  await page.waitForTimeout(2000);
  await browser.close();

  console.log('\n✅ Verification complete!');
})();
