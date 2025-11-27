import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://www.nalasbaby.com');
  console.log('✅ Loaded Nala\'s Baby');
  await page.waitForTimeout(3000);

  // Get unique product images
  const products = await page.evaluate(() => {
    const productLinks = Array.from(document.querySelectorAll('a[href*="/products/"]'));
    const seen = new Set();
    const unique = [];

    for (const link of productLinks) {
      const img = link.querySelector('img');
      if (img && img.src) {
        const productName = link.href.split('/products/')[1]?.split('?')[0];
        if (productName && !seen.has(productName)) {
          seen.add(productName);
          unique.push({
            name: productName,
            title: img.alt || productName,
            src: img.src
          });
        }
      }
    }

    return unique.slice(0, 4); // Get first 4 unique products
  });

  console.log(`\nDownloading ${products.length} unique products:\n`);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`${i + 1}. ${product.title || product.name}`);

    try {
      const response = await page.goto(product.src);
      const buffer = await response.body();
      const filename = `/Users/paulbridges/nala/truus-website/public/products/product${i + 1}.png`;
      fs.writeFileSync(filename, buffer);
      console.log(`   ✅ Downloaded (${buffer.length} bytes)`);
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }

  await browser.close();
  console.log('\n✅ Done!');
})();
