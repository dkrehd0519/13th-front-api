const { default: mongoose } = require("mongoose");

const diarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: false,
  },
  body: {
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
  img_path: {
    type: String,
    required: true,
  },
});
diarySchema.set("timestamps", true);

const Diary = mongoose.model("diary", diarySchema);
module.exports = Diary;
