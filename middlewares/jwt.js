require("dotenv").config();
const jwt = require("jsonwebtoken");
const authenticateToken=(req, res, next)=> {
    const token = req.headers["authorization"];
    
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err){ 
        
        console.log("not authorized")
        return res.sendStatus(403);
      };
     
      req.user_id = user;
      next();
    });
  }
  module.exports=authenticateToken