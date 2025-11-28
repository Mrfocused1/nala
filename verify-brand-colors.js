import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/contact');
  await page.waitForTimeout(3000);
  
  console.log('\n=== BRAND COLORS VERIFICATION ===\n');
  
  const colors = await page.evaluate(() => {
    const container = document.querySelector('.bg-\\[\\#fff5eb\\]\\/90');
    const button = document.querySelector('button');
    const input = document.querySelector('input');
    const label = document.querySelector('label');
    
    return {
      container: {
        background: window.getComputedStyle(container).backgroundColor,
        border: window.getComputedStyle(container).borderColor,
      },
      button: {
        background: window.getComputedStyle(button).backgroundColor,
        color: window.getComputedStyle(button).color,
      },
      input: {
        border: window.getComputedStyle(input).borderColor,
        color: window.getComputedStyle(input).color,
      },
      label: {
        color: window.getComputedStyle(label).color,
      }
    };
  });
  
  console.log('Container Background:', colors.container.background, '(should be cream #fff5eb)');
  console.log('Container Border:', colors.container.border, '(should be terra cotta #c1765b)');
  console.log('Button Background:', colors.button.background, '(should be terra cotta #c1765b)');
  console.log('Button Text:', colors.button.color, '(should be white)');
  console.log('Input Border:', colors.input.border, '(should be terra cotta #c1765b)');
  console.log('Label Text:', colors.label.color, '(should be dark #333333)');
  
  // Take screenshot
  const form = await page.locator('.bg-\\[\\#fff5eb\\]\\/90').first();
  await form.screenshot({ path: 'brand-colors-applied.png' });
  console.log('\n✅ Screenshot saved as brand-colors-applied.png');
  
  await browser.close();
})();
