import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);

  // Get heart/burger menu element and its position
  const heartInfo = await page.evaluate(() => {
    // The burger menu button (heart icon)
    const burgerButton = document.querySelector('header button');
    if (!burgerButton) return { error: 'Burger menu button not found' };

    const rect = burgerButton.getBoundingClientRect();
    const styles = window.getComputedStyle(burgerButton);

    // Get the parent div
    const parentDiv = burgerButton.parentElement;
    const parentRect = parentDiv.getBoundingClientRect();
    const parentStyles = window.getComputedStyle(parentDiv);

    return {
      button: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      },
      parentDiv: {
        top: parentRect.top,
        left: parentRect.left,
        marginLeft: parentStyles.marginLeft,
        marginTop: parentStyles.marginTop,
        classes: parentDiv.className
      },
      header: {
        padding: window.getComputedStyle(document.querySelector('header')).padding,
        paddingTop: window.getComputedStyle(document.querySelector('header')).paddingTop,
      }
    };
  });

  console.log('Heart Icon (Burger Menu) Position Info:');
  console.log(JSON.stringify(heartInfo, null, 2));

  await page.waitForTimeout(5000);
  await browser.close();
})();
