const express = require("express");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const scan = express();
const { BadPost, updateDB } = require("../utils");

scan.get("/scan", async (req, res) => {
  const browser = await puppeteer.launch({
    // headless: false,
    args: ["--proxy-server=socks5://127.0.0.1:9050"],
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("http://nzxj65x32vh2fkhk.onion/all");
  const content = await page.content();
  const $ = cheerio.load(content);
  browser.close();
  const badPosts = [];

  $("h4").each((idx, elem) => {
    const postToSave = { title: $(elem).text().slice(14).slice(0, -12) };
    badPosts.push(postToSave);
  });
  $("div[class=col-sm-6]:not(.text-right)").each((idx, elem) => {
    badPosts[idx].author = $(elem).text().slice(21).slice(0, -34);
    badPosts[idx].date = $(elem).text().slice(34).slice(0, -9);
  });
  $("ol").each((idx, elem) => {
    badPosts[idx].content = $(elem).children().text().replace(/\s\s+/g, " ");
  });
  updateDB(badPosts).then((data) => {
    if (data.finished === true) {
      BadPost.find().then((postArr) => {
        res.send(postArr);
      });
    } else {
      res.send({ error: data.error });
    }
  });
});

module.exports = scan;
