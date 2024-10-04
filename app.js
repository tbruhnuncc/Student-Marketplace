const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userController = require("./controllers/userController");

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

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/:id", userController.profile);

app.get("/test/:id", (req, res, next) => {
  userController.read(req, res, next);
});
