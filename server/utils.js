const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const cheerio = require("cheerio");

const postSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  date: Date,
});
const BadPost = mongoose.model("badPost", postSchema);

const openPuppeteer = async (req, res, next) => {
  const browser = await puppeteer.launch({
    // headless: false,
    args: ["--proxy-server=socks5://127.0.0.1:9050"],
  });
  const page = await browser.newPage();
  await page.goto("http://nzxj65x32vh2fkhk.onion/all");
  req.content = await page.content();
  req.browser = browser;
  if (res) {
    next();
  } else {
    return req;
  }
};

const updateDB = (postArr, res) => {
  postArr.forEach((post) => {
    BadPost.findOne({
      title: post.title,
      date: new Date(post.date),
    }).then((result) => {
      if (!result) {
        const newPost = new BadPost({
          title: post.title,
          author: post.author,
          content: post.content,
          date: new Date(post.date),
        });

        newPost.save().catch((err) => {
          console.log(err.message);
          if (res) {
            res.status(500).send({ error: err.message });
          }
        });
      }
    });
  });
};

const createDB = async () => {
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
  return badPosts;
};

module.exports = { openPuppeteer, updateDB, createDB, BadPost };
