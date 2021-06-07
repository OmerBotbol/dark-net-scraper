const puppeteer = require("puppeteer");

const openPuppeteer = async (req, res, next) => {
  const browser = await puppeteer.launch({
    // headless: false,
    args: ["--proxy-server=socks5://127.0.0.1:9050"],
  });
  const page = await browser.newPage();
  await page.goto("http://nzxj65x32vh2fkhk.onion/all");
  req.content = await page.content();
  req.browser = browser;
  next();
};

module.exports = { openPuppeteer };
