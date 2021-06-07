const express = require("express");
const cheerio = require("cheerio");
const scan = express();
const { openPuppeteer, updateDB } = require("../utils");

scan.get("/scan", openPuppeteer, (req, res) => {
  const content = req.content;
  const $ = cheerio.load(content);
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

  updateDB(badPosts, res);

  res.send(badPosts);
  req.browser.close();
});

module.exports = scan;
