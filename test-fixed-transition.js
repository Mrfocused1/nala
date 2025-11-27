import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:5173');
  console.log('✅ Loaded home page');
  await page.waitForTimeout(2000);

  // Monitor overlay state over time
  const monitorOverlay = async (duration) => {
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

    return measurements;
  };

  // Start monitoring in background
  console.log('\n🔄 Opening burger menu...');
  await page.click('header button');
  await page.waitForTimeout(1000);

  console.log('🔄 Clicking Shop link and monitoring transition...');

  // Start monitoring before clicking
  const monitorPromise = monitorOverlay(3000);

  // Trigger navigation
  await page.click('a[href="/shop"]');

  // Wait for monitoring to complete
  const measurements = await monitorPromise;

  // Analyze results
  console.log('\n📊 Transition Timeline:');
  measurements.forEach(m => {
    if (m.exists) {
      console.log(`  ${m.time}ms: opacity=${m.opacity}, display=${m.display}`);
    } else {
      console.log(`  ${m.time}ms: NO OVERLAY ✅`);
    }
  });

  // Check if overlay cleared
  const finalState = measurements[measurements.length - 1];
  if (finalState.exists) {
    console.log('\n❌ PROBLEM: Overlay still present after 3 seconds!');
  } else {
    console.log('\n✅ SUCCESS: Overlay cleared properly!');
  }

  // Verify we can see the shop page
  const shopVisible = await page.evaluate(() => {
    const shopHeading = document.querySelector('h1');
    return shopHeading?.textContent?.includes('Shop') || false;
  });

  if (shopVisible) {
    console.log('✅ Shop page is visible and accessible');
  } else {
    console.log('⚠️  Could not verify shop page visibility');
  }

  await page.waitForTimeout(2000);
  await browser.close();
})();
