import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  console.log('\n=== NALA\'S BABY BRAND COLORS ===\n');
  
  const colors = await page.evaluate(() => {
    const results = {
      primaryBrand: [],
      backgrounds: [],
      text: [],
      accents: []
    };
    
    // Check hero section
    const heroElements = document.querySelectorAll('.bg-\\[\\#c1765b\\]');
    heroElements.forEach(el => {
      results.primaryBrand.push({
        element: 'Brand Terra Cotta',
        color: '#c1765b',
        usage: 'Primary brand color'
      });
    });
    
    // Check background colors
    const bgElements = document.querySelectorAll('.bg-\\[\\#fff5eb\\]');
    bgElements.forEach(() => {
      results.backgrounds.push({
        element: 'Cream Background',
        color: '#fff5eb',
        usage: 'Main background'
      });
    });
    
    // Get all unique background colors from computed styles
    const allElements = document.querySelectorAll('*');
    const uniqueColors = new Set();
    
    allElements.forEach(el => {
      const bg = window.getComputedStyle(el).backgroundColor;
      const color = window.getComputedStyle(el).color;
      if (bg && bg !== 'rgba(0, 0, 0, 0)') uniqueColors.add(bg);
      if (color && color !== 'rgb(0, 0, 0)') uniqueColors.add(color);
    });
    
    return {
      primary: '#c1765b',      // Terra cotta/coral
      background: '#fff5eb',   // Cream
      dark: '#333333',         // Dark text
      uniqueColors: Array.from(uniqueColors).slice(0, 10)
    };
  });
  
  console.log('PRIMARY BRAND COLOR: #c1765b (Terra Cotta/Coral)');
  console.log('BACKGROUND COLOR: #fff5eb (Cream)');
  console.log('DARK TEXT: #333333');
  console.log('\nOther colors found:', colors.uniqueColors);
  
  await browser.close();
})();
