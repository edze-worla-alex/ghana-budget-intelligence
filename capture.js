
const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({ headless: true });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1
  });

  const routes = [
    ["overview", "/"],
    ["pillars", "/pillars"],
    ["indicators", "/indicators"],
    ["regional-map", "/map"],
    ["promise-tracker", "/tracker"],
    ["ask-the-budget", "/ai"],
    ["data-downloads", "/data"]
  ];

  fs.mkdirSync("screenshots", { recursive: true });

  for (const [name, route] of routes) {
    await page.goto(
      `https://ghana-budget-2027.softryve.com${route}`,
      { waitUntil: "networkidle" }
    );

    await page.waitForTimeout(2000);

    await page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
      animations: "disabled"
    });

    console.log(`Captured: ${name}`);
  }

  await browser.close();
})();
