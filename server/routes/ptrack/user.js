const { Router } = require("express");
const router = Router();
const { PTrackUser } = require("../../schema/ptrack/User");

router.get("/", (req, res) => res.send("Diary Route"));

router.post("/signup", async (req, res) => {
  try {
    const { username, password, name, email } = req.body;

    if (!username || !password || !name)
      return res.status(400).json({
        error: "invalid body",
        need: "username, password, name in body",
        got: { body: req.body, params: req.params, query: req.query },
      });

    const targetDiary = await PTrackUser.create({
      username,
      password,
      name,
      email,
    });

    if (targetDiary) return res.json({ status: "ok", uid: targetDiary._id });
    else
      return res
        .status(500)
        .json({ status: "error", msg: "Something Went Wrong" });
  } catch (e) {
    res.status(500).json({
      status: "error",
      code: e.code,
      msg: e.message,
    });
    console.error(e);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({
        error: "invalid body",
        need: "username, password in body",
        got: { body: req.body, params: req.params, query: req.query },
      });

    const targetUser = await PTrackUser.findOne({
      username,
      password,
    });

    if (targetUser)
      return res.json({
        status: "ok",
        uid: targetUser._id,
        user: { ...targetUser.toObject(), password: undefined },
      });
    else return res.status(404).json({ status: "error", msg: "No User found" });
  } catch (e) {
    res.status(500).json({
      status: "error",
      code: e.code,
      msg: e.message,
    });
    console.error(e);
  }
});

router.get("/", async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid)
      return res.status(400).json({
        error: "invalid body",
        need: "uid in query",
        got: { body: req.body, params: req.params, query: req.query },
      });

    const targetUser = await PTrackUser.findById(uid);

    if (targetUser)
      return res.json({
        status: "ok",
        uid: targetUser._id,
        user: { ...targetUser.toObject(), password: undefined },
      });
    else return res.status(404).json({ status: "error", msg: "No User found" });
  } catch (e) {
    res.status(500).json({
      status: "error",
      code: e.code,
      msg: e.message,
    });
    console.error(e);
  }
});

module.exports = router;
