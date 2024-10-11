const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo');
let passport = require('passport');
const dotenv = require("dotenv");
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');


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

  app.use(
    session({
        secret: "tvfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: url}),
        cookie: {maxAge: 60*60*1000}
        })
);

app.use(passport.authenticate('session'));

app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => { // Gets back the login page
  res.render("index");
});

app.use('/users', userRoutes);
app.use('/products', productRoutes);
