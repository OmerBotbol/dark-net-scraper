const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--proxy-server=socks5://127.0.0.1:9050"],
  });
  const page = await browser.newPage();
  await page.goto("http://nzxj65x32vh2fkhk.onion/all");
  const content = await page.content();
  const $ = cheerio.load(content);
  const badPosts = [];

  setTimeout(() => {
    browser.close();
  }, 3000);
}

main();
