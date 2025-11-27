import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll to the "As seen in" section
  await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    const element = elements.find(el => el.textContent.includes('As seen'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  await page.waitForTimeout(3000); // Wait for animation to complete

  // Check if the scribble circle is visible
  const circleInfo = await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(el =>
      el.textContent.includes('As') && el.textContent.includes('seen')
    );

    if (!h2) return { error: 'Heading not found' };

    const svg = h2.querySelector('svg');
    const path = svg ? svg.querySelector('path') : null;

    if (!path) return { error: 'SVG path not found' };

    const styles = window.getComputedStyle(path);
    const bbox = svg.getBBox();

    return {
      found: true,
      hasUnderline: !!h2.parentElement.querySelector('.bg-\\[\\#c1765b\\]'),
      hasPeriod: h2.textContent.includes('in.'),
      svgExists: !!svg,
      pathExists: !!path,
      strokeDasharray: styles.strokeDasharray,
      strokeDashoffset: styles.strokeDashoffset,
      opacity: styles.opacity,
      stroke: styles.stroke,
      svgDimensions: { width: bbox.width, height: bbox.height }
    };
  });

  console.log('\n=== SCRIBBLE CIRCLE ANIMATION CHECK ===\n');
  console.log('Circle info:', JSON.stringify(circleInfo, null, 2));
  console.log('\n✓ Underline removed:', !circleInfo.hasUnderline);
  console.log('✓ Period removed:', !circleInfo.hasPeriod);
  console.log('✓ SVG circle exists:', circleInfo.svgExists);
  console.log('✓ Animation path exists:', circleInfo.pathExists);

  await page.screenshot({ path: 'seen-animation-check.png', fullPage: true });
  console.log('\nScreenshot saved to seen-animation-check.png\n');

  await browser.close();
})();
