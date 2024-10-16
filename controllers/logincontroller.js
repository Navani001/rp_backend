
const con =require('../models/db')
const jwt = require("jsonwebtoken");
const loginUser=(req,res)=>{
    const pass = req.body.userpassword;
    name = req.body.username;
    console.log("trying to access");
    con.query(
      "SELECT * FROM login WHERE username = ?",
      [name],
      function (err, result) {
        if (err) {
          return res.status(500).send("Database error");
        }
  
        if (result.length === 0) {
          return res.send({ message: "not successful" });
        }
  
        if (result[0].userpassword === pass) {
          req.session.user_id = result[0].user_id;
          const accessToken = jwt.sign(
            result[0].user_id,
            process.env.ACCESS_TOKEN
          );
  
          res.send({
            accessToken: accessToken,
            message: "success",
            position: result[0].position,
            result: result[0],
          });
        } else {
          res.send({ message: "not successful" });
        }
      }
    );
}
const loginemail=(req,res)=>{
    var email = req.body.email;
    console.log("control change");
    con.query(
      "SELECT * FROM login where email='" + email + "'",
      function (err, result) {
        if (Object.keys(result).length == 0) {
          res.send({ message: "not successful" });
        } else if (true) {
          req.session.user_id = result[0].user_id;
          const accessToken = jwt.sign(
            result[0].user_id,
            process.env.ACCESS_TOKEN
          );
  
          res.send({
            accessToken: accessToken,
            message: "success",
            position: result[0].position,
          });
        } else {
          res.send({ message: "not successful" });
        }
      }
    );
}
module.exports ={loginUser,loginemail}