const { Router } = require("express");
const TypeTestUser = require("../schema/typeTest");

const { default: mongoose } = require("mongoose");

const router = Router();
const path = require("path");
const mime = require("mime-types");

router.get("/", (req, res) => res.send("TypeTest Route"));

router.post("/signUp", async (req, res) => {
  try {
    const { name, track, password } = req.body;

    if (!name || !track || !password) return res.status(400).json({ error: "Invalid request body" });

    const existingUser = await TypeTestUser.findOne({ name, track });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = new TypeTestUser({
      name,
      track,
      password,
    });

    await newUser.save();

    return res.json({ message: "User registered successfully", memberID: newUser._id });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const user = await TypeTestUser.findOne({ name });
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // 아이디가 틀린 경우 404
    }

    if (user.password !== password) {
      return res.status(402).json({ error: "Invalid password" }); // 비밀번호가 틀린 경우 402
    }

    res.json({ message: "Login successful", memberID: user._id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
