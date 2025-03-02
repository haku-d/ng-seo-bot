const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3005;
const TARGET_URL = process.env.TARGET_URL || "http://localhost:4200";

// Function to render the page with Puppeteer
const renderPage = async (url) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  // Get the full rendered HTML content
  const content = await page.content();
  await browser.close();
  return content;
};

function Crawler() {
  let browserWSEndpoint = null;
  const getBrowser = async () => {
    let browser = undefined;
    try {
      browser = await puppeteer.connect({
        browserWSEndpoint,
      });
    } catch (_) {
      console.log("Launching a new browser instance");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      browserWSEndpoint = browser.wsEndpoint();
    }
    return browser;
  };
  return {
    getContent: async (url) => {
      const browser = await getBrowser();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle0" });

      // Get the full rendered HTML content
      const content = await page.content();
      browser.disconnect();
      return content;
    },
  };
}

const crawler = Crawler();
// Main route to handle bot requests
app.get("*", async (req, res) => {
  const url = `${TARGET_URL}${req.originalUrl}`;
  console.log(`Start rendering page: ${url}`);
  const html = await crawler.getContent(url);
  res.send(html);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Puppeteer Middleware running on port ${PORT}`);
});
