const { Router } = require("express");
const Photo = require("../schema/photo");
const { default: mongoose } = require("mongoose");
const mime = require("mime-types");
const router = Router();
const fs = require("fs");

router.get("/", (req, res) => {});

router.get("/list", async (req, res) => {
  try {
    const photos = (await Photo.find()).map(
      ({ _id, title, text, owner_name, img_path }) => ({
        _id,
        title,
        text,
        owner_name,
        img_path,
      })
    );
    res.json(photos);
  } catch {
    res.sendStatus(500);
  }
});

router.post("/upload", async (req, res) => {
  try {
    const { title, img, text, owner_name, owner_pass } = req.body;
    if ((!title, /*!img,*/ !owner_name, !owner_pass))
      return res.status(400).json({ error: "invalid body" });

    const file = req.files.file;

    const id = new mongoose.Types.ObjectId();

    const filename = `${id}.${mime.extension(file.mimetype)}`;

    // file.mv()

    const targetPhoto = await Photo.create({
      _id: id,
      title,
      img_path: "/files/gallery/" + filename,
      text,
      owner_name,
      owner_pass,
    });

    file.mv(appRoot + "/files/gallery/" + filename);

    if (targetPhoto) return res.json({ ok: targetPhoto });
    else return res.json({ error: "Something went wrong!" });
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
});

router.post("/delete", async (req, res) => {
  try {
    console.log(req.body);
    const { id, owner_name, owner_pass } = req.body;
    if (!owner_name || !owner_pass || !id)
      return res.status(400).json({ error: "invalid body" });

    const targetPhoto = await Photo.findOneAndDelete({
      _id: id,
      owner_name: owner_name,
      owner_pass: owner_pass,
    });

    // fs.unlink()

    if (targetPhoto) {
      fs.unlink(appRoot + "/" + targetPhoto.img_path, () => {});
      return res.json({ ok: "deleted" });
    } else return res.json({ error: "not found or invalid password" });
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
});

module.exports = router;
