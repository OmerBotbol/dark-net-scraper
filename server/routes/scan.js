const express = require("express");
const scan = express();
const { BadPost } = require("../utils");

scan.get("/scan", (req, res) => {
  BadPost.find().then((result) => {
    res.send(result);
  });
});

module.exports = scan;
