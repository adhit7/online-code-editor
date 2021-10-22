const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  cid: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  htmlCode: {
    type: String,
  },
  cssCode: {
    type: String,
  },
  jsCode: {
    type: String,
  },
  postDate: {
    type: Date,
  },
});

module.exports = mongoose.model("usercodes", codeSchema);
