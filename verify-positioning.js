import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);

  const positions = await page.evaluate(() => {
    const logo = document.querySelector('header img[alt="Nala\'s Baby Logo"]')?.parentElement;
    const burgerMenu = document.querySelector('header button')?.parentElement;

    return {
      logo: logo ? {
        top: logo.getBoundingClientRect().top,
        computedTop: window.getComputedStyle(logo).top,
        classes: logo.className
      } : null,
      burgerMenu: burgerMenu ? {
        top: burgerMenu.getBoundingClientRect().top,
        computedTop: window.getComputedStyle(burgerMenu).top,
        computedLeft: window.getComputedStyle(burgerMenu).left,
        classes: burgerMenu.className
      } : null
    };
  });

  console.log('✅ Positioning Verification:');
  console.log(JSON.stringify(positions, null, 2));
  console.log('\n📊 Summary:');
  console.log(`Logo top: ${positions.logo?.top}px`);
  console.log(`Burger menu top: ${positions.burgerMenu?.top}px`);
  console.log(positions.logo?.top === 50 && positions.burgerMenu?.top === 50 ? '✅ BOTH AT 50PX!' : '❌ NOT ALIGNED');

  await page.waitForTimeout(5000);
  await browser.close();
})();
