import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  
  // Desktop audit
  const desktop = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await desktop.goto('http://localhost:5173/contact');
  await desktop.waitForTimeout(3000);
  await desktop.screenshot({ path: 'audit-desktop-full.png', fullPage: true });
  
  // Focus on form container
  const formContainer = await desktop.locator('.bg-white\\/30.backdrop-blur-md').first();
  await formContainer.screenshot({ path: 'audit-desktop-form.png' });
  
  // Tablet audit
  const tablet = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await tablet.goto('http://localhost:5173/contact');
  await tablet.waitForTimeout(2000);
  await tablet.screenshot({ path: 'audit-tablet.png', fullPage: true });
  
  // Mobile audit
  const mobile = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await mobile.goto('http://localhost:5173/contact');
  await mobile.waitForTimeout(2000);
  await mobile.screenshot({ path: 'audit-mobile.png', fullPage: true });
  
  // Interaction states - Desktop
  console.log('Testing interaction states...');
  
  // Focus state on first input
  await desktop.locator('input').first().focus();
  await desktop.screenshot({ path: 'audit-input-focus.png', fullPage: true });
  
  // Hover state on button
  await desktop.locator('button').last().hover();
  await desktop.screenshot({ path: 'audit-button-hover.png', fullPage: true });
  
  // Password field focused (eyes should close)
  await desktop.locator('input[type="password"]').focus();
  await desktop.waitForTimeout(500);
  await formContainer.screenshot({ path: 'audit-password-focus.png' });
  
  console.log('✅ All screenshots captured');
  
  // Detailed measurements
  const measurements = await desktop.evaluate(() => {
    const container = document.querySelector('.bg-white\\/30');
    const inputs = Array.from(document.querySelectorAll('input'));
    const labels = Array.from(document.querySelectorAll('label'));
    const button = document.querySelector('button[type="submit"], button:last-of-type');
    
    return {
      container: {
        width: container.getBoundingClientRect().width,
        height: container.getBoundingClientRect().height,
        padding: window.getComputedStyle(container).padding,
        gap: window.getComputedStyle(container).gap,
        backgroundColor: window.getComputedStyle(container).backgroundColor,
        backdropFilter: window.getComputedStyle(container).backdropFilter,
      },
      inputs: inputs.map(input => ({
        width: input.getBoundingClientRect().width,
        height: input.getBoundingClientRect().height,
        padding: window.getComputedStyle(input).padding,
        fontSize: window.getComputedStyle(input).fontSize,
        borderRadius: window.getComputedStyle(input).borderRadius,
        border: window.getComputedStyle(input).border,
      })),
      labels: labels.map(label => ({
        fontSize: window.getComputedStyle(label).fontSize,
        fontWeight: window.getComputedStyle(label).fontWeight,
        marginBottom: window.getComputedStyle(label).marginBottom,
        color: window.getComputedStyle(label).color,
      })),
      button: button ? {
        width: button.getBoundingClientRect().width,
        height: button.getBoundingClientRect().height,
        padding: window.getComputedStyle(button).padding,
        fontSize: window.getComputedStyle(button).fontSize,
        fontWeight: window.getComputedStyle(button).fontWeight,
        backgroundColor: window.getComputedStyle(button).backgroundColor,
        borderRadius: window.getComputedStyle(button).borderRadius,
      } : null,
    };
  });
  
  console.log('\n=== COMPREHENSIVE MEASUREMENTS ===');
  console.log(JSON.stringify(measurements, null, 2));
  
  await browser.close();
})();
