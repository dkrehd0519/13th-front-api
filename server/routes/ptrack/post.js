const { Router } = require("express");
const { PTrackPost } = require("../../schema/ptrack/Post");
const { PTrackUser } = require("../../schema/ptrack/User");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const targetPosts = await PTrackPost.find().populate("uid", "name");
    res.json({ status: "ok", targetPosts });
  } catch (e) {
    res.status(500).json({
      status: "error",
      code: e.code,
      msg: e.message,
    });
    console.error(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, body, uid } = req.body;

    if (!title || !body || !uid)
      return res.status(400).json({
        error: "invalid body",
        need: "title, body, uid in body",
        got: { body: req.body, params: req.params, query: req.query },
      });

    // Check user exist
    const user = await PTrackUser.findById(uid);

    if (!user) return res.status(403).json({ error: "No User found." });

    // Create POST
    const targetPost = await PTrackPost.create({
      title,
      body,
      uid,
    });

    if (targetPost) return res.json({ status: "ok", uid: targetPost });
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

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({
        error: "invalid body",
        need: "id in params",
        got: { body: req.body, params: req.params, query: req.query },
      });

    const targetPost = await PTrackPost.findById(id).populate("uid", "name");

    if (targetPost) return res.json({ status: "ok", uid: targetPost });
    else
      return res
        .status(404)
        .json({ status: "error", code: 404, msg: "No Post Found" });
  } catch (e) {
    res.status(500).json({
      status: "error",
      code: e.code,
      msg: e.message,
    });
    console.error(e);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { title, body, uid } = req.body;
    const { id } = req.params;

    if (!uid)
      return res.status(400).json({
        error: "invalid body",
        need: "uid in body",
        got: { body: req.body, params: req.params, query: req.query },
      });

    // Check user exist
    const user = await PTrackUser.findById(uid);
    if (!user) return res.status(403).json({ error: "No User found." });

    // Create POST
    const targetPost = await PTrackPost.findById(id);
    if (!targetPost) return res.status(404).json({ error: "No Post Found" });
    if (targetPost.uid.toString() !== uid)
      return res.status(403).json({
        error: "different owner",
        data: { uid, owner: targetPost.uid },
      });

    const updatedPost = await PTrackPost.findByIdAndUpdate(
      id,
      {
        title,
        body,
      },
      {
        returnDocument: "after",
      }
    );
    if (updatedPost) return res.json({ status: "ok", updatedPost });
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
    console.log(e.stack);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { uid } = req.body;
    const { id } = req.params;

    if (!uid)
      return res
        .status(400)
        .json({
          error: "invalid body",
          need: "uid in body",
          got: { body: req.body, params: req.params, query: req.query },
        });

    // Check user exist
    const user = await PTrackUser.findById(uid);
    if (!user) return res.status(403).json({ error: "No User found." });

    // Find POST
    const targetPost = await PTrackPost.findById(id);
    if (!targetPost) return res.status(404).json({ error: "No Post Found" });
    if (targetPost.uid.toString() !== uid)
      return res.status(403).json({
        error: "different owner",
        data: { uid, owner: targetPost.uid },
      });

    // Delete Post
    const deletePost = await PTrackPost.findByIdAndDelete(id);
    if (deletePost) return res.json({ status: "ok", deletePost });
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
    console.log(e.stack);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: "invalid body" });

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

    if (!uid) return res.status(400).json({ error: "invalid body" });

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
