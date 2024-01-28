const { Router } = require("express");
const Photo = require("../schema/photo");
const router = Router();

router.get("/", (req, res) => {});

router.get("/list", async (req, res) => {
  try {
    const photos = (await Photo.find()).map(
      ({ _id, title, captions, owner_name }) => ({
        _id,
        title,
        captions,
        owner_name,
      })
    );
    res.json(photos);
  } catch {
    res.sendStatus(500);
  }
});

router.post("/delete", async (req, res) => {
  try {
    console.log(req.body);
    const { id, password } = req.body;
    if (!id || !password)
      return res.status(400).json({ error: "invalid body" });

    const targetPhoto = await Photo.findOneAndDelete({
      _id: id,
      owner_pass: password,
    });

    if (targetPhoto) return res.json({ ok: "deleted" });
    else return res.json({ error: "not found or invalid password" });
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
});

module.exports = router;
