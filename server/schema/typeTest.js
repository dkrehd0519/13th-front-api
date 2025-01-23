const { default: mongoose } = require("mongoose");

const typeTestUserSchema = new mongoose.Schema({
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
typeTestUserSchema.set("timestamps", true);

const TypeTestUser = mongoose.model("typeTest-user", typeTestUserSchema);
module.exports = TypeTestUser;
