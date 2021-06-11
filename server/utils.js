const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  date: Date,
});
const BadPost = mongoose.model("badPost", postSchema);

const routineUpdate = async (returnData) => {
  console.log("start update");
  const browser = await puppeteer.launch({
    // headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--proxy-server=socks5://host.docker.internal:9050",
    ],
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
  await updateDB(badPosts);
  console.log("finish update");
  if (returnData) {
    return content;
  }
};

const updateDB = async (postArr) => {
  try {
    postArr.map(async (post) => {
      const result = await BadPost.findOne({
        title: post.title,
        date: new Date(post.date),
      });
      if (!result) {
        const newPost = new BadPost({
          title: post.title,
          author: post.author,
          content: post.content,
          date: new Date(post.date),
        });

        newPost.save().catch((err) => {
          console.log(err.message);
        });
      }
    });
    return { finished: true };
  } catch (err) {
    return { finished: false, error: err.message };
  }
};

module.exports = { routineUpdate, BadPost };
