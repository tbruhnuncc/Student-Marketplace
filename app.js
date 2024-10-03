const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// dot env config
dotenv.config();
const app = express();

const host = "localhost";
const port = 3000;
const url = process.env.DATABASE_URL;

mongoose
  .connect(url)
  .then(() => {
    app.listen(port, host, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((err) => console.log(err.message));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
