import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  // Listen for console messages and errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser console error:', msg.text());
    }
  });

  // Listen for failed requests
  const failedImages = [];
  page.on('response', response => {
    if (response.url().includes('media-logos') && !response.ok()) {
      failedImages.push({
        url: response.url(),
        status: response.status()
      });
    }
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll to the brands section
  await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    const element = elements.find(el => el.textContent.includes('As seen'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  await page.waitForTimeout(2000);

  // Check all logo images
  const logoInfo = await page.evaluate(() => {
    const logos = Array.from(document.querySelectorAll('img[alt*="News"], img[alt*="Standard"], img[alt*="Beauty"], img[alt*="Mother"], img[alt*="Grazia"], img[alt*="Maddyness"], img[alt*="Voice"], img[alt*="GRM"], img[alt*="Daily"]'));

    return logos.map(img => {
      const rect = img.getBoundingClientRect();
      return {
        alt: img.alt,
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        width: rect.width,
        height: rect.height,
        complete: img.complete,
        visible: rect.width > 0 && rect.height > 0
      };
    });
  });

  console.log('\n=== LOGO INSPECTION RESULTS ===\n');

  if (failedImages.length > 0) {
    console.log('❌ FAILED TO LOAD:');
    failedImages.forEach(img => {
      console.log(`  - ${img.url} (Status: ${img.status})`);
    });
    console.log('');
  }

  console.log('LOGO DETAILS:\n');
  logoInfo.forEach((logo, index) => {
    const status = logo.complete && logo.naturalWidth > 0 ? '✅' : '❌';
    console.log(`${status} Logo ${index + 1}: ${logo.alt}`);
    console.log(`   Source: ${logo.src}`);
    console.log(`   Natural size: ${logo.naturalWidth}x${logo.naturalHeight}`);
    console.log(`   Display size: ${logo.width.toFixed(0)}x${logo.height.toFixed(0)}`);
    console.log(`   Complete: ${logo.complete}`);
    console.log(`   Visible: ${logo.visible}`);
    console.log('');
  });

  // Also check for text fallbacks (logos that didn't load and show name instead)
  const textFallbacks = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.flex-shrink-0'));
    return cards
      .filter(card => {
        const hasImg = card.querySelector('img');
        const hasText = card.querySelector('span');
        return hasText && !hasImg;
      })
      .map(card => ({
        text: card.textContent.trim()
      }));
  });

  if (textFallbacks.length > 0) {
    console.log('⚠️  TEXT FALLBACKS (no image loaded):');
    textFallbacks.forEach(fb => {
      console.log(`   - ${fb.text}`);
    });
    console.log('');
  }

  await page.screenshot({ path: 'logos-check.png', fullPage: true });
  console.log('Screenshot saved to logos-check.png\n');

  await browser.close();
})();
