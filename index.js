require("dotenv").config({ path: "password.env" });
const mongoose = require("mongoose");
const express = require("express");
const router = require("./api");
var bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mongo_pass = process.env.uri;
const path = require("path");

//  adding router
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use("/", router);
//connecting mongo db
mongoose.set("strictQuery", false);
app.use(express.static(path.join(__dirname, "build")));

// Route all requests to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
const connect = async () => {
  await mongoose
    .connect(mongo_pass)
    .then(() => {
      app.listen(8080, "0.0.0.0", () => {
        console.log("app is listening on port 5000");
      });
    })
    .catch((err) => {
      console.log(err, " this is the error");
    });
};

connect();
