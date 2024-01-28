const { default: mongoose } = require("mongoose");

const recapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
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

const Recap = mongoose.model("recap", recapSchema);
module.exports = Recap;
