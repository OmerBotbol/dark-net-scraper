require("dotenv").config();
const express = require("express");
const app = express();
const cron = require("node-cron");
const api = require("./routes/scan");
const mongoose = require("mongoose");
const { createDB } = require("./utils");
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
  createDB();
});

app.use("/api", api);

module.exports = app;
