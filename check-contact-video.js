import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Check for video element
    const videoCount = await page.locator('video').count();
    
    console.log('=== CONTACT PAGE VIDEO CHECK ===');
    console.log('Number of video elements:', videoCount);
    
    if (videoCount > 0) {
      const video = page.locator('video').first();
      const sourceElement = page.locator('video source').first();
      
      const videoSrc = await sourceElement.getAttribute('src');
      const videoVisible = await video.isVisible();
      const videoBox = await video.boundingBox();
      
      console.log('Video src:', videoSrc);
      console.log('Video visible:', videoVisible);
      console.log('Video dimensions:', videoBox);
      
      // Check if video is actually loaded/playing
      const videoState = await video.evaluate(el => ({
        readyState: el.readyState,
        paused: el.paused,
        currentTime: el.currentTime,
        duration: el.duration,
        networkState: el.networkState,
        error: el.error ? el.error.message : null
      }));
      
      console.log('Video state:', videoState);
      console.log('ReadyState values: 0=HAVE_NOTHING, 1=HAVE_METADATA, 2=HAVE_CURRENT_DATA, 3=HAVE_FUTURE_DATA, 4=HAVE_ENOUGH_DATA');
      console.log('NetworkState values: 0=NETWORK_EMPTY, 1=NETWORK_IDLE, 2=NETWORK_LOADING, 3=NETWORK_NO_SOURCE');
    } else {
      console.log('❌ NO VIDEO ELEMENT FOUND ON PAGE');
    }
    
    // Check hero section structure
    const heroSection = await page.locator('section').first().innerHTML();
    console.log('\nHero section structure (first 500 chars):', heroSection.substring(0, 500));
    
    // Take screenshot
    await page.screenshot({ path: 'contact-video-check.png', fullPage: false });
    console.log('\nScreenshot saved: contact-video-check.png');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
