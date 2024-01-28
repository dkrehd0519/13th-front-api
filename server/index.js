require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const Photo = require("./schema/photo");

// Create Database
// Mongoose Connect
var mongoUri = process.env.MDB
  ? process.env.MDB
  : `mongodb://${process.env.MDB_USER}:${process.env.MDB_PASSWORD}@${process.env.MDB_ADDRESS}/${process.env.MDB_DATABASE}`;

// mongoUri =
//   process.env.NODE_ENV === "production" ? mongoUri : process.env.TEST_MDB;

mongoose
  .connect(mongoUri, { useUnifiedTopology: true, dbName: "ll-frontend" })
  .then((a) => console.log("database success"))
  .catch((e) => console.log("database failed -", e.message));

// Open Server

const port = process.env.PORT || 3000;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(`Example app listening at http://${host}:${port}`);
});

// Cors
app.use(cors());

console.log("Request");

// Middleware
process.env.NODE_ENV == "development" && app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/gallery", require("./routes/gallery"));
app.use("/recap", require("./routes/recap"));

app.get("/", (req, res) => {
  // console.log(
  //   Photo.create({
  //     title: "Test",
  //     captions: null,
  //     owner_name: "Admin",
  //     owner_pass: "AdminPass",
  //   })
  // );
  res.send("Default Route");
});

// Test
