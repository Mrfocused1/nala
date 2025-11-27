import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Check the sticker position and content
  const stickerInfo = await page.evaluate(() => {
    const sticker = document.querySelector('.rounded-full.shadow-2xl');
    if (!sticker) return { error: 'Sticker not found' };

    const rect = sticker.getBoundingClientRect();
    const svg = sticker.querySelector('svg');
    const hasHeart = sticker.querySelector('svg.lucide-heart') || sticker.textContent.includes('Heart');
    const hasBabyBottle = svg && svg.querySelector('path[fill="#c1765b"]');

    return {
      position: {
        top: rect.top,
        right: window.innerWidth - rect.right,
        left: rect.left,
        bottom: rect.bottom
      },
      dimensions: {
        width: rect.width,
        height: rect.height
      },
      hasHeart,
      hasBabyBottle,
      svgExists: !!svg,
      classes: sticker.className
    };
  });

  console.log('\n=== HERO STICKER CHECK ===\n');
  console.log('Sticker info:', JSON.stringify(stickerInfo, null, 2));
  console.log('\n✓ Positioned on right:', stickerInfo.position.right < 100);
  console.log('✓ Positioned on top:', stickerInfo.position.top < 100);
  console.log('✓ Baby bottle icon:', stickerInfo.hasBabyBottle);
  console.log('✗ Heart icon removed:', !stickerInfo.hasHeart);

  await page.screenshot({ path: 'hero-sticker-check.png' });
  console.log('\nScreenshot saved to hero-sticker-check.png\n');

  await browser.close();
})();
