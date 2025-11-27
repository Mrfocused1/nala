import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const logosDir = './public/media-logos';
  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
  }

  const logos = [
    {
      name: 'sky-news',
      url: 'https://freebiesupply.com/logos/sky-news-logo/',
      selector: 'img[alt*="Sky News"]'
    },
    {
      name: 'evening-standard',
      url: 'https://www.stickpng.com/img/icons-logos-emojis/iconic-brands/london-evening-standard-logo',
      selector: 'img.mainimage'
    },
    {
      name: 'beautymatter',
      url: 'https://brandfetch.com/beautymatter.com',
      selector: 'img[alt*="logo"]'
    },
    {
      name: 'maddyness',
      url: 'https://www.stickpng.com/img/icons-logos-emojis/tech-companies/maddyness-logo',
      selector: 'img.mainimage'
    }
  ];

  for (const logo of logos) {
    try {
      console.log(`Downloading ${logo.name}...`);
      await page.goto(logo.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Try to find download link or image
      const downloadLink = await page.$('a[download], a[href$=".png"]');

      if (downloadLink) {
        const href = await downloadLink.getAttribute('href');
        const imageUrl = href.startsWith('http') ? href : new URL(href, logo.url).href;

        const imageResponse = await page.goto(imageUrl);
        const buffer = await imageResponse.body();

        fs.writeFileSync(path.join(logosDir, `${logo.name}.png`), buffer);
        console.log(`✓ Downloaded ${logo.name}.png`);
      }
    } catch (error) {
      console.error(`✗ Failed to download ${logo.name}:`, error.message);
    }
  }

  // Download Voice Online logo (custom approach)
  console.log('Downloading voice-online logo...');
  try {
    // Voice Online doesn't have easily accessible logo, we'll use a placeholder
    // You may need to manually obtain this logo
    console.log('⚠ Voice Online logo requires manual download');
  } catch (error) {
    console.error('✗ Failed to download voice-online:', error.message);
  }

  await browser.close();
  console.log('\n✓ Logo download complete!');
})();
