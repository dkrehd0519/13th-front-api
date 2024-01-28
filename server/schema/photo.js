const { default: mongoose } = require("mongoose");

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  img_path: {
    type: String,
    required: true,
  },
  text: {
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
});
photoSchema.set("timestamps", true);

const Photo = mongoose.model("photo", photoSchema);
module.exports = Photo;
