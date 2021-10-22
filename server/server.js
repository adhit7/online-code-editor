const port = 3001;
const express = require("express");
const app = express();
const cors = require("cors");
const configData = require("./config");

// Connecting DB
const mongoose = require("mongoose");
mongoose.connect(configData.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to DB");
});

app.use(cors());
app.use(express.json({ limit: 2000000 }));
app.use(express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Getting Routes
const addDataRoute = require("./routes/addData");
const getDataRoute = require("./routes/getData");
const editDataRoute = require("./routes/editData");
const deleteDataRoute = require("./routes/deleteData");

app.use("/adddata", addDataRoute);
app.use("/getdata", getDataRoute);
app.use("/editdata", editDataRoute);
app.use("/deletedata", deleteDataRoute);

app.listen(port, () => {
  console.log(`Server started successfully on port ${port}`);
});
