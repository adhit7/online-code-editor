const jwt = require("jsonwebtoken");
const secretKey = require("../config").secretKey;

const verifyJwtToken = (req, res, next) => {
  const bearerHeader = req.headers.auth;

  if (typeof bearerHeader != "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];

    req.token = bearerToken;

    next();
  } else {
    res.status(403).send("Forbidden");
  }
};

module.exports = verifyJwtToken;
