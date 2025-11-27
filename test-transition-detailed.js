import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:5173');
  console.log('✅ Loaded home page');
  await page.waitForTimeout(2000);

  // Monitor overlay state over time
  const monitorOverlay = async (label, duration) => {
    const startTime = Date.now();
    const measurements = [];

    while (Date.now() - startTime < duration) {
      const state = await page.evaluate(() => {
        const overlay = Array.from(document.querySelectorAll('div')).find(div => {
          const style = window.getComputedStyle(div);
          return style.position === 'fixed' && style.zIndex === '200';
        });
        return overlay ? {
          exists: true,
          opacity: window.getComputedStyle(overlay).opacity,
          display: window.getComputedStyle(overlay).display
        } : { exists: false };
      });

      measurements.push({
        time: Date.now() - startTime,
        ...state
      });

      await page.waitForTimeout(100);
    }

    console.log(`\n${label}:`);
    measurements.forEach(m => {
      if (m.exists) {
        console.log(`  ${m.time}ms: opacity=${m.opacity}, display=${m.display}`);
      } else {
        console.log(`  ${m.time}ms: NO OVERLAY`);
      }
    });
  };

  // Click shop
  console.log('\n🔄 Opening burger menu...');
  await page.click('header button');
  await page.waitForTimeout(1000);

  console.log('🔄 Clicking Shop link...');
  await page.click('a[href="/shop"]');

  // Monitor for 3 seconds
  await monitorOverlay('Transition monitoring', 3000);

  await page.waitForTimeout(2000);
  await browser.close();
})();
