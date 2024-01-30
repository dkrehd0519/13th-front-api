const { Router } = require("express");
const Diary = require("../schema/diary");
const { default: mongoose } = require("mongoose");
const mime = require("mime-types");
const router = Router();
const fs = require("fs");

router.get("/", (req, res) => res.send("Diary Route"));

router.get("/list", async (req, res) => {
  try {
    const diary = (await Diary.find()).map(
      ({
        _id,
        title,
        date,
        body,
        owner_name,
        img_path,
        createdAt,
        updatedAt,
      }) => ({
        _id,
        title,
        date,
        body,
        owner_name,
        img_path,
        createdAt,
        updatedAt,
      })
    );
    res.json(diary);
  } catch {
    res.sendStatus(500);
  }
});
router.get("/get/:id", async (req, res) => {
  try {
    const {
      _id,
      title,
      date,
      body,
      owner_name,
      img_path,
      createdAt,
      updatedAt,
    } = await Diary.findById(req.params.id);

    res.json({
      _id,
      title,
      date,
      body,
      owner_name,
      img_path,
      createdAt,
      updatedAt,
    });
  } catch {
    res.sendStatus(500);
  }
});

router.post("/create", async (req, res) => {
  try {
    const { title, date, body, owner_name, owner_pass } = req.body;
    const file = req.files?.owner_image;

    if (!title || !date || !body || !owner_name || !owner_pass || !file)
      return res.status(400).json({ error: "invalid body" });

    const id = new mongoose.Types.ObjectId();

    const filename = "/files/diary/" + `${id}.${mime.extension(file.mimetype)}`;

    // file.mv()

    const targetDiary = await Diary.create({
      _id: id,
      title,
      date,
      body,
      owner_name,
      owner_pass,
      img_path: filename,
    });

    file.mv(appRoot + filename);

    if (targetDiary) return res.json({ ok: targetDiary });
    else return res.json({ error: "Something went wrong!" });
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
});

router.post("/delete/:id", async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const { owner_pass } = req.body;
    if (!owner_pass || !id)
      return res.status(400).json({ error: "invalid body" });

    const targetDiary = await Diary.findOneAndDelete({
      _id: id,
      owner_pass: owner_pass,
    });

    // fs.unlink()

    if (targetDiary) {
      fs.unlink(appRoot + "/" + targetDiary.img_path, () => {});
      return res.json({ ok: "deleted" });
    } else return res.json({ error: "not found or invalid password" });
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
});

router.post("/update", async (req, res) => {
  try {
    const { title, date, body, owner_name, owner_pass, id } = req.body;
    // const file = req.files?.owner_image;

    if (!title || !date || !body || !owner_name || !owner_pass || !id)
      return res.status(400).json({ error: "invalid body" });

    const targetDiary = await Diary.updateOne(
      { _id: id, owner_pass },
      {
        title,
        date,
        body,
        owner_name,
      }
    );

    if (targetDiary) return res.json({ ok: targetDiary });
    else return res.json({ error: "Something went wrong!" });
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
});

module.exports = router;
