import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Intercept console logs
  page.on('console', msg => console.log('Browser console:', msg.text()));

  await page.goto('http://localhost:5173');
  console.log('✅ Loaded home page');

  // Inject logging into the page
  await page.evaluate(() => {
    const originalLog = console.log;
    window.transitionLog = [];
    console.log = (...args) => {
      window.transitionLog.push(args.join(' '));
      originalLog.apply(console, args);
    };
  });

  await page.waitForTimeout(2000);

  console.log('\n🔄 Opening burger menu...');
  await page.click('header button');
  await page.waitForTimeout(1000);

  console.log('🔄 Clicking Shop link...');
  await page.click('a[href="/shop"]');

  // Monitor for state changes over 3 seconds
  for (let i = 0; i < 30; i++) {
    const info = await page.evaluate(() => {
      // Try to find the ScribbleOverlay component's state
      const overlay = Array.from(document.querySelectorAll('div')).find(div => {
        const style = window.getComputedStyle(div);
        return style.position === 'fixed' && style.zIndex === '200';
      });

      return {
        time: Date.now(),
        overlayExists: !!overlay,
        opacity: overlay ? window.getComputedStyle(overlay).opacity : null
      };
    });

    console.log(`${i * 100}ms: overlay=${info.overlayExists}, opacity=${info.opacity}`);
    await page.waitForTimeout(100);
  }

  await page.waitForTimeout(2000);
  await browser.close();
})();
