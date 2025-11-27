import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll to the contact form
  await page.evaluate(() => {
    const form = document.querySelector('form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  await page.waitForTimeout(2000);

  // Check if contact form exists
  const formInfo = await page.evaluate(() => {
    const form = document.querySelector('form');
    if (!form) return { error: 'Form not found' };

    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const topicSelect = form.querySelector('select');
    const messageTextarea = form.querySelector('textarea');
    const submitButton = form.querySelector('button[type="submit"]');

    return {
      found: true,
      hasNameInput: !!nameInput,
      hasEmailInput: !!emailInput,
      hasTopicSelect: !!topicSelect,
      hasMessageTextarea: !!messageTextarea,
      hasSubmitButton: !!submitButton,
      submitButtonText: submitButton?.textContent,
      formBackgroundColor: window.getComputedStyle(form.closest('div')).backgroundColor
    };
  });

  console.log('\n=== CONTACT FORM CHECK ===\n');
  console.log('Form info:', JSON.stringify(formInfo, null, 2));
  console.log('\n✓ Form exists:', formInfo.found);
  console.log('✓ Has name input:', formInfo.hasNameInput);
  console.log('✓ Has email input:', formInfo.hasEmailInput);
  console.log('✓ Has topic select:', formInfo.hasTopicSelect);
  console.log('✓ Has message textarea:', formInfo.hasMessageTextarea);
  console.log('✓ Has submit button:', formInfo.hasSubmitButton);

  await page.screenshot({ path: 'contact-form-check.png', fullPage: true });
  console.log('\nScreenshot saved to contact-form-check.png\n');

  await browser.close();
})();
