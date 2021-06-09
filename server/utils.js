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

module.exports = { updateDB, BadPost };
