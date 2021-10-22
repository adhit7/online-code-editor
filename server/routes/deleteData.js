const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const verifyDecodeToken = require("../middlewares/verifyDecodeToken");

// Getting DB models
const userModel = require("../models/userModel");
const codeModel = require("../models/codeModel");

// Delete a particular code
router.delete("/user/code", verifyDecodeToken, async (req, res) => {
  try {
    const { uid } = req.headers.user;
    const { cid } = req.headers;

    const deleteCode = await codeModel.findOneAndDelete({ uid: uid, cid: cid });

    res.status(200).send("Deleted Successfully");
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
