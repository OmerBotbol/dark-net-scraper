const express = require("express");
const scan = express();
const { BadPost, createDB } = require("../utils");

scan.get("/scan", (req, res) => {
  BadPost.find().then((result) => {
    if (result.length === 0) {
      createDB().then((posts) => {
        res.send(posts);
      });
    } else {
      res.send(result);
    }
  });
});

module.exports = scan;
