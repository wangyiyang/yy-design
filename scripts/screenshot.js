#!/usr/bin/env node
/**
 * YY Design · HTML to PNG Screenshot
 * Usage: node screenshot.js <input.html> <output.png> [width] [height]
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function screenshot(inputPath, outputPath, width = 1200, height = 630) {
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found ${inputPath}`);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: parseInt(width), height: parseInt(height) },
    deviceScaleFactor: 2 // Retina quality
  });

  const fileUrl = 'file://' + path.resolve(inputPath);
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Wait for any animations to settle
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: outputPath,
    fullPage: false
  });

  await browser.close();
  console.log(`✓ Screenshot saved: ${outputPath} (${width}x${height} @2x)`);
}

const [,, input, output, width, height] = process.argv;
if (!input || !output) {
  console.log('Usage: node screenshot.js <input.html> <output.png> [width] [height]');
  console.log('Example: node screenshot.js cover.html cover.png 1200 630');
  process.exit(1);
}

screenshot(input, output, width, height).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
