const mysql = require("mysql");
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Navan@123",
    database: "brp6",
  });
  
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });
  module.exports = con;
  