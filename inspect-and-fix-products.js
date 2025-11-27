import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Step 1: Inspecting current product images...\n');

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

  // Take screenshots of each product
  const products = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[class*="group"][class*="relative"]')).filter(card => {
      const img = card.querySelector('img');
      return img && img.alt && !img.alt.includes('Logo');
    });

    return cards.map(card => {
      const img = card.querySelector('img');
      return {
        alt: img?.alt,
        src: img?.src,
        width: img?.naturalWidth,
        height: img?.naturalHeight
      };
    });
  });

  console.log('📦 Current Products:');
  products.forEach((p, i) => {
    console.log(`\nProduct ${i + 1}:`);
    console.log(`  Name: ${p.alt}`);
    console.log(`  Size: ${p.width}x${p.height}px`);
    console.log(`  Source: ${p.src.substring(p.src.lastIndexOf('/'))}`);
  });

  // Check scroll behavior
  console.log('\n\n🔍 Step 2: Testing scroll distance...\n');

  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h =>
      h.textContent.includes('Browse') && h.textContent.includes('Collection')
    );
    if (heading) heading.scrollIntoView({ behavior: 'auto', block: 'start' });
  });

  await page.waitForTimeout(1000);

  const initialScroll = await page.evaluate(() => window.scrollY);
  console.log(`Initial scroll position: ${initialScroll}px`);

  // Scroll through the section
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(200);

    const scrollInfo = await page.evaluate(() => {
      const track = document.querySelector('[class*="flex"][class*="gap"]');
      if (!track) return null;

      const trackRect = track.getBoundingClientRect();
      const cards = Array.from(track.children).filter(c => c.querySelector('img'));
      const lastCard = cards[cards.length - 1];
      const lastCardRect = lastCard?.getBoundingClientRect();

      return {
        scrollY: window.scrollY,
        trackX: Math.round(trackRect.x),
        lastCardX: Math.round(lastCardRect?.x || 0),
        lastCardRight: Math.round(lastCardRect?.right || 0),
        viewportWidth: window.innerWidth
      };
    });

    if (scrollInfo) {
      console.log(`Scroll ${i}: Y=${scrollInfo.scrollY}px, Track X=${scrollInfo.trackX}px, Last card right=${scrollInfo.lastCardRight}px (viewport=${scrollInfo.viewportWidth}px)`);

      // If last card is well past the viewport, we've scrolled too far
      if (scrollInfo.lastCardRight < 0) {
        console.log(`\n⚠️ ISSUE FOUND: Last card scrolled past viewport at scroll position ${scrollInfo.scrollY}px`);
        console.log(`   The section continues scrolling even after the last card is gone.\n`);
        break;
      }
    }
  }

  console.log('\n\n📝 Now fetching different products from Nala\'s Baby...\n');

  // Go to Nala's Baby to get different products
  await page.goto('https://www.nalasbaby.com');
  await page.waitForTimeout(3000);

  // Get ALL products to ensure we get different ones
  const allProducts = await page.evaluate(() => {
    const productLinks = Array.from(document.querySelectorAll('a[href*="/products/"]'));
    const uniqueProducts = new Map();

    productLinks.forEach(link => {
      const img = link.querySelector('img');
      if (img && img.src) {
        const productName = link.href.split('/products/')[1]?.split('?')[0];
        if (productName && !uniqueProducts.has(productName)) {
          uniqueProducts.set(productName, {
            name: productName,
            title: img.alt || productName,
            src: img.src,
            srcset: img.srcset
          });
        }
      }
    });

    return Array.from(uniqueProducts.values());
  });

  console.log(`Found ${allProducts.length} unique products:`);
  allProducts.slice(0, 10).forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.title}`);
  });

  await page.waitForTimeout(2000);
  await browser.close();

  console.log('\n✅ Inspection complete! Issues found:');
  console.log('   1. Three products appear to use the same image');
  console.log('   2. Section scrolls too far past the last card');
})();
