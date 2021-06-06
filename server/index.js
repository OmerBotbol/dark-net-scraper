const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const PORT = 3001;

app.get("/scan/:keyWord", async (req, res) => {
  const { keyWord } = req.params;
  console.log(keyWord);
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--proxy-server=socks5://127.0.0.1:9050"],
  });
  const page = await browser.newPage();
  await page.goto("http://nzxj65x32vh2fkhk.onion/all");
  const content = await page.content();
  const $ = cheerio.load(content);
  const badPosts = [];

  $("h4").each((idx, elem) => {
    const title = $(elem).text();
    if (title.includes(keyWord)) {
      badPosts.push(title);
    }
  });
  res.send(badPosts);

  setTimeout(() => {
    browser.close();
  }, 3000);
});

app.listen(PORT, () => {
  console.log("listening to port " + PORT);
});
