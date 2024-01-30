const { default: mongoose } = require("mongoose");

const talkImageSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true,
  },
  c_answer: {
    // 내용 답변
    type: String,
    required: false,
  },
  t_answer: {
    // 제목 답변
    type: String,
    required: true,
  },
  q_id: {
    // 질문 Id
    type: String,
    required: true,
  },
  img_path: {
    type: String,
    required: true,
  },
});
talkImageSchema.set("timestamps", true);

const TalkImage = mongoose.model("talk-image", talkImageSchema);
module.exports = TalkImage;
