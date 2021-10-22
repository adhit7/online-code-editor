const express = require("express");
const router = express.Router();
const verifyDecodeToken = require("../middlewares/verifyDecodeToken");

// Getting DB models
const userModel = require("../models/userModel");
const codeModel = require("../models/codeModel");

// Check token
router.get("/checktoken", verifyDecodeToken, async (req, res) => {
  try {
    // console.log("called")
    res.status(200).json(req.headers.user);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Get Profile Data
router.get("/user/profile", verifyDecodeToken, async (req, res) => {
  try {
    const { uid } = req.headers.user;

    const userData = await userModel.findOne({ uid: uid });

    res.status(200).json({ message: "profile", user: userData });
  } catch (e) {
    return res.status(500).send("Server Error");
  }
});

// Get User Saved Codes
router.get("/user/codes", verifyDecodeToken, async (req, res) => {
  try {
    const { uid } = req.headers.user;

    const codeData = await codeModel
      .find({ uid: uid })
      .select({ uid: 1, cid: 1, title: 1, postDate: 1 });

    res.status(200).json(codeData);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Get User Particular Code
router.get("/user/code/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const codeData = await codeModel.findOne({ cid: cid });

    if (codeData == null) {
      return res.sendStatus(404);
    }

    res.status(200).json(codeData);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Get every user's codes with details of the user
router.get("/public/codes", async (req, res) => {
  try {
    const codeData = await codeModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "uid",
          foreignField: "uid",
          as: "user_details",
        },
      },
      {
        $project: {
          title: 1,
          cid: 1,
          uid: 1,
          postDate: 1,
          "user_details.userName": 1,
          "user_details.picUrl": 1,
        },
      },
    ]);

    res.status(200).json(codeData);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
