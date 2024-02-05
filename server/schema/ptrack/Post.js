const { default: mongoose } = require("mongoose");

const PostSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ptrack-user",
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  filename: {
    type: Array,
    required: false,
    default: [],
  },
});
PostSchema.set("timestamps", true);

module.exports.PTrackPost = mongoose.model("ptrack-post", PostSchema);
