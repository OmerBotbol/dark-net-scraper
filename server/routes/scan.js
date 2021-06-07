const express = require("express");
const cheerio = require("cheerio");
const scan = express();
const { openPuppeteer } = require("../utils");

scan.get("/scan", openPuppeteer, (req, res) => {
  const content = req.content;
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
  req.browser.close();
});

module.exports = scan;
