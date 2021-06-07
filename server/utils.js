const puppeteer = require("puppeteer");
const mongoose = require("mongoose");

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
  next();
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
          res.status(500).send({ error: err.message });
        });
      }
    });
  });
};

module.exports = { openPuppeteer, updateDB };
