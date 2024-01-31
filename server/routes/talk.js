const { Router } = require("express");
const TalkUser = require("../schema/talkUser");
const TalkImage = require("../schema/talkImage");
const { default: mongoose } = require("mongoose");
const mime = require("mime-types");
const router = Router();
const fs = require("fs");

router.get("/", (req, res) => res.send("/"));

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password)
      return res.status(400).json({ error: "invalid body" });

    const targetTalkUser = await TalkUser.findOneAndUpdate(
      {
        name,
        password,
      },
      {
        name,
        password,
      },
      { upsert: true, new: true }
    );

    if (targetTalkUser)
      return res.json({ ok: targetTalkUser, memberID: targetTalkUser._id });
    else return res.json({ error: "Something went wrong!" });
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
});

router.get("/mypage/list/:memberId", async (req, res) => {
  const { memberId } = req.params;
  try {
    // const photos = await TalkImage.find({ memberId });

    const photos = await TalkImage.aggregate([
      {
        $match: {
          memberId,
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
      { $group: { _id: "$q_id", latest: { $first: "$$ROOT" } } },
    ]);

    res.json({ photos });
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.post("/mypage/get/:memberId", async (req, res) => {
  const { memberId } = req.params;
  const { qid } = req.body;
  try {
    // const photos = await TalkImage.find({ memberId });

    const photo = await TalkImage.findOne({
      memberId,
      q_id: qid,
    }).sort({
      updatedAt: -1,
    });

    res.json({ photo });
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});

router.post("/mypage/answer", async (req, res) => {
  try {
    const { c_answer, t_answer, memberID, q_id } = req.body;
    const file = req.files?.image;
    if (!c_answer || !t_answer || !memberID || !q_id || !file)
      return res.status(400).json({ error: "invalid body" });

    const id = new mongoose.Types.ObjectId();

    const filename = `${id}.${mime.extension(file.mimetype)}`;

    // file.mv()

    const targetTalkImage = await TalkImage.create({
      _id: id,
      img_path: "/files/talk/" + filename,
      c_answer,
      t_answer,
      memberId: memberID,
      q_id,
    });

    file.mv(appRoot + "/files/talk/" + filename);

    if (targetTalkImage) return res.json({ ok: targetTalkImage });
    else return res.json({ error: "Something went wrong!" });
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
});

router.post("/mypage/delete/:qid", async (req, res) => {
  try {
    const { qid } = req.params;
    const { memberID } = req.body;
    if (!memberID) return res.status(400).json({ error: "invalid body" });

    const targetTalkUser = await TalkImage.find({
      q_id: qid,
      memberId: memberID,
    });

    const deleteTalkUser = await TalkImage.deleteMany({
      q_id: qid,
      memberId: memberID,
    });

    if (targetTalkUser) {
      targetTalkUser.map((element) =>
        fs.unlink(appRoot + element.img_path, () => {})
      );

      return res.json({ ok: { targetTalkUser, deleteTalkUser } });
    } else return res.json({ error: "not found or invalid password" });
    return res.sendStatus(200);
    // fs.unlink()
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
});

module.exports = router;
