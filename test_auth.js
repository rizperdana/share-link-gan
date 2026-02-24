const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Listen to all console events and print them
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[Browser Console Error]: ${msg.text()}`);
      console.log(`[Location]: ${msg.location().url}:${msg.location().lineNumber}`);
    } else {
      console.log(`[Browser Console]: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`[Browser Uncaught Exception]: ${error.message}`);
    console.log(error.stack);
  });

  try {
    console.log("Navigating to login...");
    await page.goto('http://localhost:4500/login');
    await page.waitForLoadState('networkidle');

    console.log("Filling login form...");
    await page.fill('input[type="email"]', 'tester99@example.com');
    await page.fill('input[type="password"]', 'password123');

    // The button might be different, let's find the submit button
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      console.log("Clicking submit...");
      await submitBtn.click();
    } else {
      console.log("Could not find submit button.");
    }

    console.log("Waiting 5s for navigation or errors...");
    await page.waitForTimeout(5000);
    console.log("Current URL:", page.url());

  } catch (e) {
    console.log("Test script error:", e);
  } finally {
    await browser.close();
  }
})();
