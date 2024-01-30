const { default: mongoose } = require("mongoose");

const talkUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
});
talkUserSchema.set("timestamps", true);

const TalkUser = mongoose.model("talk-user", talkUserSchema);
module.exports = TalkUser;
