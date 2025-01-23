const { Router } = require("express");
const GroupingUser = require("../schema/groupingUser");
const GroupingBoard = require("../schema/groupingBoard");
const { default: mongoose } = require("mongoose");

const router = Router();
const path = require("path");
const mime = require("mime-types");

router.get("/", (req, res) => res.send("Grouping Route"));

router.post("/signUp", async (req, res) => {
  try {
    const { name, track, password } = req.body;

    if (!name || !track || !password) return res.status(400).json({ error: "Invalid request body" });

    const existingUser = await GroupingUser.findOne({ name, track });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = new GroupingUser({
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

    const user = await GroupingUser.findOne({ name });
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

router.get("/", (req, res) => res.send("Grouping Route"));

// 그룹 추가 (POST)
router.post("/addGroup", async (req, res) => {
  try {
    const { groupName, date, startTime, endTime, location, maxNum, description, category, memberID } = req.body;
    const file = req.files?.img;

    if (
      !groupName ||
      !date ||
      !file ||
      !memberID ||
      !startTime ||
      !endTime ||
      !location ||
      !maxNum ||
      !description ||
      !category
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // memberID로 사용자 조회
    const user = await GroupingUser.findById(memberID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const id = new mongoose.Types.ObjectId();

    const filename = "/files/grouping/" + `${id}.${mime.extension(file.mimetype)}`;

    // 자동으로 이름 추가
    const newGroup = await GroupingBoard.create({
      groupName,
      date,
      startTime,
      endTime,
      location,
      maxNum,
      description,
      category,
      img_path: filename,
      createdBy: user.name, // memberID로 조회한 사용자 이름 자동 삽입
    });

    file.mv(appRoot + filename);

    await newGroup.save();

    res.json({ message: "Group created successfully", groupID: newGroup._id });
  } catch (error) {
    console.error("Error adding group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 전체 그룹 목록 조회 (GET)
router.get("/groupList", async (req, res) => {
  try {
    const groups = await GroupingBoard.find({}, "img_path category createdBy groupName location");
    res.json(groups);
  } catch (error) {
    console.error("Error fetching group list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/groupList/:groupID", async (req, res) => {
  try {
    const { groupID } = req.params;

    const groupDetail = await GroupingBoard.findById(
      groupID,
      "img_path category createdBy groupName location date startTime endTime maxNum description"
    );

    if (!groupDetail) {
      return res.status(404).json({ error: "groupDetail not found" });
    }

    res.json(groupDetail);
  } catch (error) {
    console.error("Error fetching group detail:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/joinGroup/:groupID", async (req, res) => {
  try {
    const { groupID } = req.params;
    const { memberID } = req.body;

    if (!memberID) {
      return res.status(400).json({ error: "memberID is required" });
    }

    // 사용자 존재 여부 확인
    const user = await GroupingUser.findById(memberID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 그룹 조회
    const group = await GroupingBoard.findById(groupID);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // 이미 입장한 사용자 확인
    if (group.participants.includes(user.name)) {
      return res.status(409).json({ error: "User already joined the group" });
    }

    // 참가자 추가
    await GroupingBoard.findByIdAndUpdate(groupID, { $push: { participants: user.name } }, { new: true });

    res.json({ message: "User joined the group successfully", groupID });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/groupParticipants/:groupID", async (req, res) => {
  try {
    const { groupID } = req.params;
    const { memberID } = req.query; // 쿼리로 memberID 받기

    // 그룹 조회 (participants와 maxNum 필드만 가져오기)
    const group = await GroupingBoard.findById(groupID, "participants maxNum");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // 참가 인원 및 최대 인원 수 확인
    const participantCount = group.participants.length;
    const maxNum = parseInt(group.maxNum, 10) || 0; // maxNum이 문자열로 저장될 가능성 처리

    // 모집 인원과 참가 인원 비교
    const isOpen = participantCount < maxNum;

    // 사용자가 참가했는지 확인
    let hasJoined = false;
    if (memberID) {
      const user = await GroupingUser.findById(memberID);
      if (user) {
        hasJoined = group.participants.includes(user.name);
      }
    }

    res.json({
      participants: group.participants,
      participantCount: participantCount,
      maxNum: maxNum,
      isOpen: isOpen,
      hasJoined: hasJoined,
    });
  } catch (error) {
    console.error("Error fetching group participants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

// title, category, createdBy, date, startTime, endTime, maxNum, description
