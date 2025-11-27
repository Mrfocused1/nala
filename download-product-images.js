import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://www.nalasbaby.com');
  console.log('✅ Loaded Nala\'s Baby website');

  await page.waitForTimeout(3000);

  // Get product images
  const products = await page.evaluate(() => {
    const productCards = Array.from(document.querySelectorAll('[class*="product"]')).slice(0, 4);

    return productCards.map((card, i) => {
      const img = card.querySelector('img');
      if (img) {
        return {
          index: i + 1,
          src: img.src,
          srcset: img.srcset,
          alt: img.alt
        };
      }
      return null;
    }).filter(Boolean);
  });

  console.log('\n📦 Found products:');
  products.forEach(p => {
    console.log(`\nProduct ${p.index}:`);
    console.log(`  Alt: ${p.alt}`);
    console.log(`  Src: ${p.src}`);
  });

  // Download each image
  for (const product of products) {
    if (product.src) {
      try {
        const imageResponse = await page.goto(product.src);
        const buffer = await imageResponse.body();
        const filename = `/Users/paulbridges/nala/truus-website/public/products/product${product.index}.png`;
        fs.writeFileSync(filename, buffer);
        console.log(`\✅ Downloaded product${product.index}.png (${buffer.length} bytes)`);
      } catch (error) {
        console.log(`❌ Failed to download product${product.index}: ${error.message}`);
      }
    }
  }

  await browser.close();
  console.log('\n✅ Done!');
})();
