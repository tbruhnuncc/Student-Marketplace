const express = require("express");

const app = express();
const PORT = 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
