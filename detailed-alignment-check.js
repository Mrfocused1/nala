import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);

  const details = await page.evaluate(() => {
    const logoContainer = document.querySelector('header img[alt="Nala\'s Baby Logo"]')?.parentElement;
    const logoImg = document.querySelector('header img[alt="Nala\'s Baby Logo"]');
    const burgerContainer = document.querySelector('header button')?.parentElement;
    const burgerButton = document.querySelector('header button');
    const burgerSVG = document.querySelector('header button svg');

    return {
      logoContainer: logoContainer ? {
        top: logoContainer.getBoundingClientRect().top,
        height: logoContainer.getBoundingClientRect().height,
        classes: logoContainer.className
      } : null,
      logoImg: logoImg ? {
        top: logoImg.getBoundingClientRect().top,
        height: logoImg.getBoundingClientRect().height,
      } : null,
      burgerContainer: burgerContainer ? {
        top: burgerContainer.getBoundingClientRect().top,
        height: burgerContainer.getBoundingClientRect().height,
        classes: burgerContainer.className
      } : null,
      burgerButton: burgerButton ? {
        top: burgerButton.getBoundingClientRect().top,
        height: burgerButton.getBoundingClientRect().height,
        width: burgerButton.getBoundingClientRect().width,
      } : null,
      burgerSVG: burgerSVG ? {
        top: burgerSVG.getBoundingClientRect().top,
        height: burgerSVG.getBoundingClientRect().height,
      } : null
    };
  });

  console.log('🔍 Detailed Alignment Analysis:');
  console.log(JSON.stringify(details, null, 2));
  console.log('\n📊 Visual Top Positions:');
  console.log(`Logo image top: ${details.logoImg?.top}px`);
  console.log(`Burger SVG (heart) top: ${details.burgerSVG?.top}px`);
  console.log(`Difference: ${Math.abs((details.logoImg?.top || 0) - (details.burgerSVG?.top || 0))}px`);

  await page.waitForTimeout(5000);
  await browser.close();
})();
