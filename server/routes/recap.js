const { Router } = require("express");
const Recap = require("../schema/recap");
const router = Router();

router.get("/", (req, res) => {});

router.get("/list", async (req, res) => {
  try {
    const recaps = (await Recap.find()).map(
      ({ _id, title, body, owner_name }) => ({
        _id,
        title,
        body,
        owner_name,
      })
    );
    res.json(recaps);
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

    const targetRecap = await Recap.findOneAndDelete({
      _id: id,
      owner_pass: password,
    });

    if (targetRecap) return res.json({ ok: "deleted" });
    else return res.json({ error: "not found or invalid password" });
  } catch (e) {
    if (e.name === "CastError")
      return res.status(500).json({ error: "Can't Cast Body" });
    res.sendStatus(500);
    console.error(e);
  }
});
router.get("/get", async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "invalid body" });

    const targetRecap = await Recap.findOne({
      _id: id,
    });

    if (targetRecap) {
      const { _id, title, body, owner_name } = targetRecap;
      return res.json({ _id, title, body, owner_name });
    } else return res.json({ error: "not found" });
  } catch (e) {
    if (e.name === "CastError")
      return res.status(500).json({ error: "Can't Cast Body" });
    res.sendStatus(500);
    console.error(e);
  }
});

router.post("/add", async (req, res) => {
  try {
    console.log(req.body);
    const { title, body, owner_name, owner_pass } = req.body;

    if (!title || !body || !owner_name || !owner_pass)
      return res.status(400).json({ error: "invalid body" });

    const targetRecap = await Recap.create({
      title,
      body,
      owner_name,
      owner_pass,
    });

    if (targetRecap) return res.json({ ok: targetRecap });
    else return res.json({ error: "something went wrong" });
  } catch (e) {
    if (e.name === "CastError")
      return res.status(500).json({ error: "Can't Cast Body" });
    res.sendStatus(500);
    console.error(e);
  }
});

router.post("/update", async (req, res) => {
  try {
    console.log(req.body);
    const { title, body, owner_name, owner_pass, id } = req.body;

    if (!title || !body || !owner_name || !owner_pass || !id)
      return res.status(400).json({ error: "invalid body" });

    const targetRecap = await Recap.updateOne({
      _id: id,
      title,
      body,
      owner_name,
      owner_pass,
    });

    if (targetRecap) return res.json({ ok: targetRecap });
    else return res.json({ error: "something went wrong" });
  } catch (e) {
    if (e.name === "CastError")
      return res.status(500).json({ error: "Can't Cast Body" });
    res.sendStatus(500);
    console.error(e);
  }
});

module.exports = router;
