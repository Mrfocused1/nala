import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:5173');
  console.log('✅ Loaded home page');
  await page.waitForTimeout(2000);

  // Check initial state
  const initialOverlay = await page.evaluate(() => {
    const overlay = document.querySelector('[class*="scribble"]');
    const allDivs = Array.from(document.querySelectorAll('div')).filter(div => {
      const style = window.getComputedStyle(div);
      return style.position === 'fixed' && style.zIndex === '200';
    });
    return {
      found: !!overlay,
      scribbleElements: allDivs.length,
      allFixedElements: Array.from(document.querySelectorAll('div[style*="position: fixed"]')).map(el => ({
        zIndex: window.getComputedStyle(el).zIndex,
        display: window.getComputedStyle(el).display,
        className: el.className
      }))
    };
  });
  console.log('Initial overlay state:', JSON.stringify(initialOverlay, null, 2));

  // Click on Shop link in burger menu
  console.log('\n🔄 Opening burger menu...');
  await page.click('header button');
  await page.waitForTimeout(1000);

  console.log('🔄 Clicking Shop link...');
  await page.click('a[href="/shop"]');
  await page.waitForTimeout(500);

  // Check overlay during transition
  const duringTransition = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div')).filter(div => {
      const style = window.getComputedStyle(div);
      return style.position === 'fixed' && (style.zIndex === '200' || style.zIndex === '9999');
    });
    return allDivs.map(el => ({
      zIndex: window.getComputedStyle(el).zIndex,
      display: window.getComputedStyle(el).display,
      opacity: window.getComputedStyle(el).opacity,
      pointerEvents: window.getComputedStyle(el).pointerEvents,
      className: el.className,
      hasChildren: el.children.length > 0
    }));
  });
  console.log('\n📊 During transition:', JSON.stringify(duringTransition, null, 2));

  await page.waitForTimeout(2000);

  // Check after transition should complete
  const afterTransition = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div')).filter(div => {
      const style = window.getComputedStyle(div);
      return style.position === 'fixed' && (style.zIndex === '200' || style.zIndex === '9999');
    });
    return {
      overlayCount: allDivs.length,
      overlays: allDivs.map(el => ({
        zIndex: window.getComputedStyle(el).zIndex,
        display: window.getComputedStyle(el).display,
        opacity: window.getComputedStyle(el).opacity,
        pointerEvents: window.getComputedStyle(el).pointerEvents,
        className: el.className,
        visible: window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).opacity !== '0'
      })),
      currentPath: window.location.pathname
    };
  });
  console.log('\n📊 After transition (should be clear):', JSON.stringify(afterTransition, null, 2));

  if (afterTransition.overlayCount > 0) {
    console.log('\n❌ PROBLEM: Overlay still present after transition!');
  } else {
    console.log('\n✅ Overlay cleared successfully');
  }

  await page.waitForTimeout(5000);
  await browser.close();
})();
