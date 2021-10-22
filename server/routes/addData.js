const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const secretKey = require("../config").secretKey;
const verifyDecodeToken = require("../middlewares/verifyDecodeToken");

// Getting DB models
const userModel = require("../models/userModel");
const codeModel = require("../models/codeModel");

router.get("/", (req, res) => {
  res.send("Here we add data");
});

// User Registration Route
router.post("/register/user", async (req, res) => {
  try {
    const checkOldData = await userModel.findOne({
      userEmail: req.body.userEmail,
    });

    if (checkOldData != null) {
      return res.status(409).send("Email already exists");
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);
    req.body.uid = uuidv4();
    const newData = new userModel(req.body);
    const savedData = await newData.save();

    res.status(201).json(savedData);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// User Login Route
router.post("/login/user", async (req, res) => {
  try {
    const { email, pass } = req.body;
    const data = await userModel.findOne({ userEmail: email });

    if (data == null) {
      return res.status(404).json({ message: "User not found" });
    }

    const checkPass = await bcrypt.compare(pass, data.password);
    if (!checkPass) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    const user = {
      uid: data.uid,
      userName: data.userName,
      userEmail: data.userEmail,
    };

    // Generating Token
    const token = jwt.sign({ user }, secretKey, { expiresIn: "24h" });

    res.status(200).json({ token: token });
  } catch (e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
});

// User Code Save Route
router.post("/user/code/save", verifyDecodeToken, async (req, res) => {
  try {
    const { uid } = req.headers.user;
    const cid = uuidv4();
    const postDate = Date.now();

    const data = new codeModel({ ...req.body, cid, uid, postDate });

    const savedCode = await data.save();

    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
