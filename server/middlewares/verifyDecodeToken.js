const jwt = require("jsonwebtoken");
const secretKey = require("../config").secretKey;

const verifyJwtToken = (req, res, next) => {
  const bearerHeader = req.headers.auth;

  if (typeof bearerHeader != "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];

    req.token = bearerToken;

    const data = jwt.verify(bearerToken, secretKey, (err, token)=>{
        if(err){
            return "Forbidden";
        }
        else{
            return token;
        }
    });

    if(data == "Forbidden"){
        return res.status(403).send("Forbidden");
    }
    
    var user = data.user;
    req.headers = {...req.headers, user};

    next();
  } else {
    res.status(403).send("Forbidden");
  }
};

module.exports = verifyJwtToken;
