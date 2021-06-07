require("dotenv").config();
const express = require("express");
const app = express();
const api = require("./routes/scan");
const mongoose = require("mongoose");
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

app.use("/api", api);

// cron.schedule("*/2 * * * *", () => {
//   const content = req.content;
//   const $ = cheerio.load(content);

//   $("div[class=col-sm-6]:not(.text-right)")
//     .slice(0, 1)
//     .each((idx, elem) => {
//       const currentTime = Date.now();
//       const lastPostDate = new Date(
//         $(elem).text().slice(34).slice(0, -9)
//       ).getTime();
//       if (currentTime > lastPostDate) {
//         res.json({ isNew: false });
//       } else {
//         res.send({ isNew: true });
//       }
//     });
// });

module.exports = app;
