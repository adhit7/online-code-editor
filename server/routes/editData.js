const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const verifyDecodeToken = require("../middlewares/verifyDecodeToken");

// Getting DB models
const userModel = require("../models/userModel");
const codeModel = require("../models/codeModel");

// Fetch user profile details for changing
router.get("/user/profile", verifyDecodeToken, async (req, res) => {
  try {
    const { uid } = req.headers.user;

    const profileData = await userModel.findOne({ uid: uid });
    // console.log(profileData);

    res.status(200).json(profileData);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// User profile details change route
router.post("/user/profile", verifyDecodeToken, async (req, res) => {
  try {
    const { uid } = req.headers.user;
    const newData = req.body;

    const updatedData = await userModel.findOneAndUpdate(
      { uid: uid },
      req.body,
      { new: true }
    );
    // console.log(updatedData);

    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// User password change route
router.post("/user/pass", verifyDecodeToken, async (req, res) => {
  try {
    const { uid } = req.headers.user;
    var newPass = req.body.password;

    newPass = await bcrypt.hash(newPass, 10);

    const updateData = await userModel.findOneAndUpdate(
      { uid: uid },
      { password: newPass },
      { new: true }
    );

    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// User code change route
router.post("/user/code", verifyDecodeToken, async (req, res) => {
  try {
    const { uid } = req.headers.user;
    const { cid } = req.body;

    // console.log(req.body);

    const saveCodeData = await codeModel.findOneAndUpdate(
      { uid: uid, cid: cid },
      req.body,
      { new: true }
    );

    res.status(200).send("Updated successfully");
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
