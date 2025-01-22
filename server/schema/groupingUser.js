const { default: mongoose } = require("mongoose");

const groupingUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  track: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
});
groupingUserSchema.set("timestamps", true);

const GroupingUser = mongoose.model("grouping-user", groupingUserSchema);
module.exports = GroupingUser;
