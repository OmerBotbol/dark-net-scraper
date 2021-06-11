const express = require("express");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const scan = express();
const { BadPost, routineUpdate } = require("../utils");

scan.get("/scan", (req, res) => {
  BadPost.find().then((result) => {
    res.send(result);
  });
});

scan.get("/test", (req, res) => {
  routineUpdate(true).then((result) => {
    res.send(result);
  });
});

scan.get("/google", async (req, res) => {
  const browser = await puppeteer.launch({
    // headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("http://google.com");
  const content = await page.content();
  res.send(content);
  browser.close();
});

module.exports = scan;
