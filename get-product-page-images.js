import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const productUrls = [
    'https://www.nalasbaby.com/products/nala-s-baby-full-range-bundle',
    'https://www.nalasbaby.com/products/nala-s-luxury-gift-set',
    'https://www.nalasbaby.com/products/nalas-baby-skin-bundle-w-bag',
    'https://www.nalasbaby.com/products/vanilla-cloud-soft-skin-duo'
  ];

  console.log('📥 Downloading product page images...\n');

  for (let i = 0; i < productUrls.length; i++) {
    console.log(`Product ${i + 1}: ${productUrls[i].split('/').pop()}`);

    try {
      await page.goto(productUrls[i]);
      await page.waitForTimeout(2000);

      // Get the main product image
      const imageUrl = await page.evaluate(() => {
        // Try multiple selectors for product images
        const selectors = [
          '.product__media img',
          '[class*="product"][class*="image"] img',
          'img[src*="products"]',
          '.main-product-image img'
        ];

        for (const selector of selectors) {
          const img = document.querySelector(selector);
          if (img && img.src && img.src.includes('cdn.shopify')) {
            // Get the largest version by removing size parameters
            return img.src.split('?')[0].replace(/_\d+x\d+/, '_2048x2048');
          }
        }

        return null;
      });

      if (imageUrl) {
        console.log(`  Found: ${imageUrl.substring(imageUrl.lastIndexOf('/'))}`);

        const response = await page.goto(imageUrl);
        const buffer = await response.body();
        const filename = `/Users/paulbridges/nala/truus-website/public/products/product${i + 1}.png`;
        fs.writeFileSync(filename, buffer);
        console.log(`  ✅ Downloaded (${buffer.length} bytes)\n`);
      } else {
        console.log(`  ❌ No image found\n`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
    }
  }

  await browser.close();
  console.log('✅ Done!');
})();
