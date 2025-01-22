const { default: mongoose } = require("mongoose");

const groupingBoardSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  maxNum: {
    type: String,
    required: false,
  },
  currentNum: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  img_path: {
    type: String,
    required: true,
  },
  img_path: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
});
groupingBoardSchema.set("timestamps", true);

const GroupingBoard = mongoose.model("grouping-board", groupingBoardSchema);
module.exports = GroupingBoard;
