import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:5173');
  console.log('✅ Loaded home page');

  // Scroll down to the Browse Collection section
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await page.waitForTimeout(2000);

  // Find the Browse Collection section
  const browseSection = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h =>
      h.textContent.includes('Browse') && h.textContent.includes('Collection')
    );

    if (!heading) return { found: false };

    // Scroll to the section
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });

    return { found: true, text: heading.textContent };
  });

  console.log('Browse Collection section:', browseSection);
  await page.waitForTimeout(2000);

  // Check product cards
  const productInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[class*="group"][class*="relative"]')).filter(card => {
      const img = card.querySelector('img');
      return img && img.alt && !img.alt.includes('Logo');
    });

    return {
      totalCards: cards.length,
      cards: cards.map((card, i) => {
        const img = card.querySelector('img');
        const rect = card.getBoundingClientRect();
        return {
          index: i,
          visible: rect.width > 0 && rect.height > 0,
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y,
          imageSrc: img?.src || 'no image',
          imageAlt: img?.alt || 'no alt',
          imageLoaded: img?.complete || false,
          imageNaturalWidth: img?.naturalWidth || 0
        };
      })
    };
  });

  console.log('\n📊 Product Cards Analysis:');
  console.log('Total cards found:', productInfo.totalCards);
  console.log('\nCard Details:');
  productInfo.cards.forEach(card => {
    console.log(`\nCard ${card.index}:`);
    console.log(`  Visible: ${card.visible}`);
    console.log(`  Position: (${Math.round(card.x)}, ${Math.round(card.y)})`);
    console.log(`  Size: ${Math.round(card.width)}x${Math.round(card.height)}`);
    console.log(`  Image loaded: ${card.imageLoaded}`);
    console.log(`  Image size: ${card.imageNaturalWidth}px`);
    console.log(`  Alt: ${card.imageAlt}`);
  });

  // Try scrolling horizontally to see other cards
  console.log('\n🔄 Attempting to scroll horizontally...');
  await page.evaluate(() => {
    const track = document.querySelector('[class*="flex"][class*="gap"]');
    if (track) {
      console.log('Track found, scrolling...');
    }
  });

  await page.waitForTimeout(5000);
  await browser.close();
})();
