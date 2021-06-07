require("dotenv").config();
const express = require("express");
const app = express();
const cron = require("node-cron");
const api = require("./routes/scan");
const mongoose = require("mongoose");
const { openPuppeteer, updateDB } = require("./utils");
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

cron.schedule("*/2 * * * *", async () => {
  const empty = {};
  const req = await openPuppeteer(empty);
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

  updateDB(badPosts);
  req.browser.close();
});

app.use("/api", api);

module.exports = app;
