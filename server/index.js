const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const PORT = 3001;

app.get("/scan", async (req, res) => {
  const browser = await puppeteer.launch({
    // headless: false,
    args: ["--proxy-server=socks5://127.0.0.1:9050"],
  });
  const page = await browser.newPage();
  await page.goto("http://nzxj65x32vh2fkhk.onion/all");
  const content = await page.content();
  const $ = cheerio.load(content);
  const badPosts = [];

  $("h4").each((idx, elem) => {
    const badPost = { title: $(elem).text().slice(14).slice(0, -12) };
    badPosts.push(badPost);
  });
  $("div[class=col-sm-6]:not(.text-right)").each((idx, elem) => {
    badPosts[idx].author = $(elem).text().slice(21).slice(0, -34);
    badPosts[idx].date = $(elem).text().slice(34).slice(0, -9);
  });
  $("ol").each((idx, elem) => {
    badPosts[idx].content = $(elem).children().text().replace(/\s\s+/g, " ");
  });

  res.send(badPosts);

  setTimeout(() => {
    browser.close();
  }, 3000);
});

app.listen(PORT, () => {
  console.log("listening to port " + PORT);
});
