const { default: mongoose } = require("mongoose");

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  captions: {
    type: String,
    required: false,
  },
  owner_name: {
    type: String,
    required: true,
  },
  owner_pass: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
});

const Photo = mongoose.model("photo", photoSchema);
module.exports = Photo;
