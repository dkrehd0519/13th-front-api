require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const Photo = require("./schema/photo");
const fileupload = require("express-fileupload");
const fs = require("fs");

// Global Exports
global.appRoot = __dirname;

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

// File upload
app.use(
  fileupload({
    limits: { fileSize: 10 * 1024 * 1024 },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: appRoot + "/tmp/",
    safeFileNames: true,
    preserveExtension: false, // default
  })
);
// Create Required Dirs
if (!fs.existsSync(appRoot + "/files/"))
  fs.mkdirSync(appRoot + "/files/", { recursive: true });
if (!fs.existsSync(appRoot + "/files/gallery"))
  fs.mkdirSync(appRoot + "/files/gallery", { recursive: true });
if (!fs.existsSync(appRoot + "/files/diary"))
  fs.mkdirSync(appRoot + "/files/diary", { recursive: true });
if (!fs.existsSync(appRoot + "/files/talk"))
  fs.mkdirSync(appRoot + "/files/talk", { recursive: true });

app.use("/files", express.static("files"));

// Middleware
process.env.NODE_ENV == "development" && app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/diary", require("./routes/diary"));
app.use("/gallery", require("./routes/gallery"));
app.use("/recap", require("./routes/recap"));
app.use("/talk", require("./routes/talk"));

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
