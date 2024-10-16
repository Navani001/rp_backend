const express = require("express");
const session = require("express-session");
const path = require("path");
const cron = require("node-cron");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const PDFParser = require("pdf-parse");
const mammoth = require("mammoth");
const pdf = require("html-pdf");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const con = require("./models/db");
const login = require("./routes/login.js");
const student = require("./routes/student.js");
const faculty = require("./routes/faculty.js");
const admin = require("./routes/admin.js");
const requestIp = require("request-ip");
const sessionMiddleware = require("./middlewares/session");
app.use(cookieParser());
app.use(sessionMiddleware);
const authenticateToken = require("./middlewares/jwt.js");
const nodemailer = require("nodemailer");

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "navaneethakrishnan.cs23@bitsathy.ac.in", // Your Gmail email address
    clientId:
    process.env.GOOGLE_CLIENT_ID, // OAuth 2.0 client ID
    clientSecret:  process.env.GOOGLE_CLIENT_SECRET, // OAuth 2.0 client secret
    refreshToken:
      "1//04NlMnm368bo6CgYIARAAGAQSNwF-L9Ir_X66LLQprsRrmn2McCG-UJz48kApxqHETyIYD409psTbldE66xeqpHVPDyf39Vd9jDk", // OAuth 2.0 refresh token
  },
  tls: {
    rejectUnauthorized: false, // This may be required in some environments
  },
});

const mailOptions = {
  from: "Personalized Skill <ps@bitsathy.ac.in>",
  to: "navaneethakrishnan.cs23@bitsathy.ac.in",
  subject: "reminder for event",
  text: "gentle reminder",
};

// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.log("Error occurred: " + error.message);
//   }
//   console.log("Email sent: " + info.response);
// });

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.134.131:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://10.40.32.69:5000/",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "__" + file.originalname);
  },
});

const upload = multer({ storage: storage });
app.use("/", login);
app.use("/student", student);
app.use("/faculty", faculty);
app.use("/admin", admin);

app.post("/upload", upload.single("pdf"), (req, res) => {
  const image = req.file.filename;
  const event_name = req.body.eventId;

  const sqlInsert = `UPDATE event_details SET document = ? WHERE Activity_name = ?;`;
  con.query(sqlInsert, ["images/" + image, event_name], function (err, result) {
    if (err) {
      throw err;
    }
  });
  console.log("file uploaded");
  res.send("File uploaded successfully.");
});
app.post("/get/document", (req, res) => {
  console.log("get documnent");
  console.log(req.body);
  console.log(req.body.team_id);
  const sql = `SELECT certificate,geoTag,document FROM report WHERE team_id =?;`;
  con.query(sql, [req.body.team_id], function (err, result) {
    if (err) {
      throw err;
    }

    res.send({ message: result });
  });
});
app.post(
  "/upload2/studentinsert",
  authenticateToken,
  upload.single("pdf"),
  (req, res) => {
    const image = req.file.filename;
    const title = req.body.title;
    const event_id = req.body.event_id;
    const user_id = req.user_id;
    console.log(user_id, event_id);

    const sqlInsert =
      `insert into report (user_id,event_id,` + title + `) value(?,?,?);`;
    con.query(
      sqlInsert,
      [user_id, event_id, "images/" + image],
      function (err, result) {
        if (err) {
          throw err;
        }
        console.log(result);
      }
    );
    console.log("file uploaded");
    res.send("File uploaded successfully.");
  }
);
app.post("/upload2/insert", upload.single("pdf"), (req, res) => {
  const image = req.file.filename;
  const title = req.body.title;
  const team_id = req.body.team_id;

  const sqlInsert = `insert into report (team_id,` + title + `) value(?,?);`;
  con.query(sqlInsert, [team_id, "images/" + image], function (err, result) {
    if (err) {
      throw err;
    }
  });
  console.log("file uploaded");
  res.send("File uploaded successfully.");
});
app.post("/upload2/update", upload.single("pdf"), (req, res) => {
  const image = req.file.filename;
  const title = req.body.title;
  const team_id = req.body.team_id;

  const sqlInsert = `UPDATE report SET ` + title + ` = ? WHERE team_id = ?;`;
  con.query(sqlInsert, ["images/" + image, team_id], function (err, result) {
    if (err) {
      throw err;
    }
  });
  console.log("file uploaded");
  res.send("File uploaded successfully.");
});
app.post("/addevents", authenticateToken, function (req, res) {
  const eventdata = req.body.eventdata;
  const department = req.body.departmentdata;
  const userId = req.user_id;
  const points = req.body.points;
  const level = eventdata.setps.slice(
    eventdata.setps.length - 1,
    eventdata.setps.length
  );
  const program = eventdata.setps.slice(0, eventdata.setps.length - 2);

  pointstring = "";
  points.map((o) => {
    pointstring += " select '" + o.name + "' as name";
    pointstring += " ,'" + o.maxMarks + "' as point";
    pointstring += " ,'" + o.level + "' as level";
    pointstring += " Union All ";
  });
  pointstring = pointstring.slice(0, pointstring.length - 10);

  const event = eventdata.rewardmode ? "reward" : "honour";
  const mode = eventdata.onlinemode ? "online" : "offline";

  departmentstring = "";
  department.map((a) => {
    departmentstring += "(";
    departmentstring += "d.department_name= '" + a.department + "'";
    departmentstring += " and d.year= '" + a.year + "'";
    departmentstring += ")or";
  });
  event_id = 0;
  con.query(
    "select count(*) as count from event_details",
    function (err, resut) {
      if (err) throw err;
      var eventcode = resut[0].count + 1;
      eventcode = "2425-OD-" + String(eventcode).padStart(4, "0");

      departmentstring = [
        departmentstring.slice(0, departmentstring.length - 2),
      ];

      const query = `INSERT INTO brp6.event_details (StartDate,Activity_name,Activity_code,Activity_type, Activity_category, points, Organizer, Availability, duration, description, EndDate, start_bigintscheduling, end_bigintscheduling, No_of_students_expected, faculty_id,team_size,levelCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;
      const values = [
        eventdata.startDateTime,
        eventdata.eventName,
        eventcode,
        eventdata.EventType,
        event,
        eventdata.maxPoints,
        userId,
        eventdata.noOfStudents,
        eventdata.duration,
        eventdata.eventDetails,
        eventdata.endDateTime,
        eventdata.schedulingStartDateTime,
        eventdata.schedulingEndDateTime,
        eventdata.noOfStudents,
        userId,
        eventdata.teamsize,
        eventdata.round,
      ];
      const query2 =
        `
insert into department_event(department_id,Event_id) select d.department_id,e.event_id  from department d,event_details e where (` +
        departmentstring +
        `) and e.Activity_name= "` +
        eventdata.eventName +
        `"`;
      const query3 =
        `insert into points_event(Event_id,point_Name,max_point,level) SELECT e.event_id,name,point,level FROM event_details e JOIN (` +
        pointstring +
        `) AS marks_table  WHERE e.Activity_code = "` +
        eventcode +
        `"`;

      con.query(query, values, function (err, result) {
        if (err) {
          throw err;
        }
        console.log("added");
      });

      con.query(query2, function (err, result) {
        if (err) {
          throw err;
        }
        console.log("department added");
      });
      con.query(query3, function (err, result) {
        if (err) {
          throw err;
        }
        console.log("points added");
      });
      con.query(
        "INSERT INTO `brp6`.`ps_events_requirement`(`ps_event_id`,`event_id`,levell)VALUES((select ps_event_id from ps_events where ps_event_name='" +
          program +
          "'),(select event_id from event_details where ACtivity_code='" +
          eventcode +
          "')," +
          level +
          ");",
        function (err, result) {
          if (err) {
            throw err;
          }
          console.log("requirements added");
          res.send("Event added successfully.");
        }
      );
    }
  );
});

app.get("/notifications", authenticateToken, function (req, res) {
  const userId = req.user_id;
  const query =
    "(SELECT e.StartDate, e.Activity_name, e.Activity_code, 'point added' AS type FROM points_collected p JOIN event_details e ON e.Event_id = p.Event_id WHERE user_id = ? UNION ALL SELECT e.StartDate, e.Activity_name, e.Activity_code, 'registered' AS type FROM registered_events re JOIN event_details e ON re.Event_id = e.Event_id WHERE user_id = ?) ORDER BY StartDate";

  con.query(query, [userId, userId], function (err, result) {
    if (err) {
      return res.status(500).send("Error fetching notifications.");
    }
    res.send({ message: result });
  });
});

app.get("/profiledata", authenticateToken, function (req, res) {
  const userId = req.user_id;
  const query =
    "SELECT p.*, e.Activity_name FROM brp6.points_collected p JOIN brp6.event_details e ON e.Activity_code = p.Activity_code WHERE p.user_id = ?";

  con.query(query, [userId], function (err, result) {
    if (err) {
      return res.status(500).send("Error fetching profile data.");
    }
    res.send({ message: result });
  });
});

app.get("/adminreport", authenticateToken, function (req, res) {
  var id = req.body.id;
  con.query(
    "select ps.point,pe.max_point,ps.task_id,ps.student_id,pe.point_Name from points_students ps join points_event pe on ps.task_id=pe.task_id where pe.event_id=" +
      id,
    function (err, result) {
      if (err) {
        throw err;
      }
      res.send({ message: result });
    }
  );
});

app.post("/internal_rp", function (req, res) {
  const dept = req.body.dept;
  const rr = req.body.rr;
  const year = req.body.year;
  var student_data = [];

  const mark = {
    mathematics: "theory",
    physics: "theory",
    chemistry: "lab",
    electronics: "lab",
    computing: "lab",
  };

  const theoryPoints = 11;
  const labPoints = 15;

  let lab = 0;
  let theory = 0;

  // Count the number of theory and lab subjects
  for (let sub in mark) {
    if (mark[sub] === "lab") {
      lab++;
    } else {
      theory++;
    }
  }

  const totalPoints =
    lab * (5 + 3 * 2 + 2 * 4 + 1 * 6) * rr +
    theory * (5 + 3 * 2 + 2 * 4 + 1 * 6) * rr;
  let lab_percentage = (lab * (5 + 3 * 2 + 2 * 4 + 1 * 6) * rr) / totalPoints;
  let theory_percentage =
    (theory * (5 + 3 * 2 + 2 * 4 + 1 * 6) * rr) / totalPoints;

  con.query(
    "SELECT user_id FROM login WHERE department_id = (SELECT department_id FROM department WHERE department_name = '" +
      dept +
      "' AND year = " +
      year +
      ");",
    function (err, result) {
      if (err) throw err;

      // Conversion rate or scaling factor

      let promises = result.map((student) => {
        return new Promise((resolve, reject) => {
          con.query(
            "SELECT balance FROM student_rp_gatered WHERE user_id = ?",
            [student.user_id],
            function (err, balanceResult) {
              if (err) return reject(err);

              let studnt_mark = { id: student.user_id };
              let balance = balanceResult[0].balance;

              let student_lab_mark = parseInt(lab_percentage * balance);
              let student_theory_mark = parseInt(theory_percentage * balance);
              let rp_balance =
                balance - (student_lab_mark + student_theory_mark);

              for (let sub in mark) {
                let student_mark = 0;
                if (mark[sub] === "lab") {
                  let current_sub = parseInt(student_lab_mark / lab);

                  let current_point = 0;
                  if (5 * rr <= current_sub) {
                    current_point += 5 * rr;
                    current_sub -= 5 * rr;
                    student_mark += 5;
                  } else {
                    for (let i = 5; i != 0; i--) {
                      if (current_sub >= i * rr) {
                        current_point += i * rr;
                        current_sub -= i * rr;
                        student_mark += i;
                        rp_balance += current_sub - i * rr;
                        break;
                      }
                    }
                  }
                  if (3 * 2 * rr <= current_sub) {
                    current_point += 3 * 2 * rr;
                    current_sub -= 3 * 2 * rr;
                    student_mark += 3;
                  } else {
                    for (let i = 2; i != 0; i--) {
                      if (current_sub >= i * 2 * rr) {
                        current_point += i * 2 * rr;
                        current_sub -= i * 2 * rr;
                        rp_balance += current_sub - i * 2 * rr;
                        student_mark += i;
                        break;
                      }
                    }
                  }
                  if (2 * 4 * rr <= current_sub) {
                    current_point += 2 * 4 * rr;
                    current_sub -= 2 * 4 * rr;
                    student_mark += 2;
                  } else {
                    for (let i = 1; i != 0; i--) {
                      if (current_sub >= i * 4 * rr) {
                        current_point += i * 4 * rr;
                        current_sub -= i * 4 * rr;
                        rp_balance += current_sub - i * 4 * rr;
                        student_mark += i;
                        break;
                      }
                    }
                  }
                  if (6 * rr <= current_sub) {
                    current_point += 6 * rr;
                    current_sub -= 6 * rr;
                    student_mark += 1;
                  }
                  studnt_mark[sub + " points"] = current_point;
                  studnt_mark[sub + " mark"] = student_mark;
                } else {
                  let current_sub = parseInt(
                    (student_theory_mark + rp_balance) / theory
                  );
                  rp_balance = (student_theory_mark + rp_balance) % theory;

                  let current_point = 0;
                  if (5 * rr <= current_sub) {
                    current_point += 5 * rr;
                    current_sub -= 5 * rr;
                    student_mark += 5;
                  } else {
                    for (let i = 5; i != 0; i--) {
                      if (current_sub >= i * rr) {
                        current_point += i * rr;
                        current_sub -= i * rr;
                        student_mark += i;
                        rp_balance += current_sub - i * rr;
                        break;
                      }
                    }
                  }
                  if (3 * 2 * rr <= current_sub) {
                    current_point += 3 * 2 * rr;
                    current_sub -= 3 * 2 * rr;
                    student_mark += 3;
                  } else {
                    for (let i = 2; i != 0; i--) {
                      if (current_sub >= i * 2 * rr) {
                        current_point += i * 2 * rr;
                        current_sub -= i * 2 * rr;
                        rp_balance += current_sub - i * 2 * rr;
                        student_mark += i;
                        break;
                      }
                    }
                  }
                  if (2 * 4 * rr <= current_sub) {
                    current_point += 2 * 4 * rr;
                    current_sub -= 2 * 4 * rr;
                    student_mark += 2;
                  } else {
                    for (let i = 1; i != 0; i--) {
                      if (current_sub >= i * 4 * rr) {
                        current_point += i * 4 * rr;
                        current_sub -= i * 4 * rr;
                        rp_balance += current_sub - i * 4 * rr;
                        student_mark += i;
                        break;
                      }
                    }
                  }
                  if (6 * rr <= current_sub) {
                    current_point += 6 * rr;
                    current_sub -= 6 * rr;
                    student_mark += 1;
                  }
                  studnt_mark[sub + " points"] = current_point;
                  studnt_mark[sub + " mark"] = student_mark;
                }
              }
              student_data.push(studnt_mark);
              resolve();
            }
          );
        });
      });

      Promise.all(promises)
        .then(() => {
          res.send({ message: student_data });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("An error occurred.");
        });
    }
  );
});

// spilte mark

// app.post("/internal_rp", function (req, res) {
//   console.log("hi");
//   const dept = req.body.dept;
//   const rr = req.body.rr;
//   const year = req.body.year;
//   var student_data = [];

//   const mark = {
//     mathematics: "theory",
//     physics: "theory",
//     chemistry: "lab",
//     electronics: "lab",
//     computing: "lab",
//   };

//   const theoryPoints = 11;
//   const labPoints = 15;

//   let lab = 0;
//   let theory = 0;

//   // Count the number of theory and lab subjects
//   for (let sub in mark) {
//     if (mark[sub] === "lab") {
//       lab++;
//     } else {
//       theory++;
//     }
//   }

//   const totalPoints =
//     lab * (8 + 4 * 2 + 2 * 4 + 1 * 6) * rr +
//     theory * (5 + 3 * 2 + 2 * 4 + 1 * 6) * rr;
//   let lab_percentage = (lab * (8 + 4 * 2 + 2 * 4 + 1 * 6) * rr) / totalPoints;
//   let theory_percentage =
//     (theory * (5 + 3 * 2 + 2 * 4 + 1 * 6) * rr) / totalPoints;

//   console.log(lab_percentage, theory_percentage);

//   con.query(
//     "SELECT user_id FROM student_details WHERE department = (SELECT department_id FROM department WHERE department_name = '"+
//       dept+
//       "' AND year = " +
//       year +
//       ");",
//     function (err, result) {
//       if (err) throw err;

//       // Conversion rate or scaling factor

//       let promises = result.map((student) => {
//         return new Promise((resolve, reject) => {
//           con.query(
//             "SELECT balance FROM student_rp_gatered WHERE user_id = ?",
//             [student.user_id],
//             function (err, balanceResult) {
//               if (err) return reject(err);

//               let studnt_mark = { id: student.user_id };
//               let balance = balanceResult[0].balance;

//               let student_lab_mark = parseInt(lab_percentage * balance);
//               let student_theory_mark = parseInt(theory_percentage * balance);
//               let rp_balance =
//                 balance - (student_lab_mark + student_theory_mark);

//               for (let sub in mark) {
//                 let student_mark = 0;
//                 if (mark[sub] === "lab") {
//                   let current_sub = parseInt(student_lab_mark / lab);

//                   let current_point = 0;
//                   if (8 * rr <= current_sub) {
//                     current_point += 8 * rr;
//                     student_mark += 8;
//                     current_sub -= 8 * rr;
//                   } else {
//                     for (let i = 8; i != 0; i--) {
//                       if (current_sub >= i * rr) {
//                         current_point += i * rr;
//                         current_sub -= i * rr;
//                         student_mark += i;
//                         rp_balance += current_sub - i * rr;
//                         break;
//                       }
//                     }
//                   }
//                   if (4 * 2 * rr <= current_sub) {
//                     current_point += 4 * 2 * rr;
//                     current_sub -= 4 * 2 * rr;
//                     student_mark += 4;
//                   } else {
//                     for (let i = 3; i != 0; i--) {
//                       if (current_sub >= i * 2 * rr) {
//                         current_point += i * 2 * rr;
//                         current_sub -= i * 2 * rr;
//                         rp_balance += current_sub - i * 2 * rr;
//                         student_mark += i;
//                         break;
//                       }
//                     }
//                   }
//                   if (4 * 2 * rr <= current_sub) {
//                     current_point += 4 * 2 * rr;
//                     current_sub -= 4 * 2 * rr;
//                     student_mark += 2;
//                   } else {
//                     for (let i = 2; i != 0; i--) {
//                       if (current_sub >= i * 4 * rr) {
//                         current_point += i * 4 * rr;
//                         current_sub -= i * 4 * rr;
//                         rp_balance += current_sub - i * 4 * rr;
//                         student_mark += i;
//                         break;
//                       }
//                     }
//                   }
//                   if (6 * rr <= current_sub) {
//                     current_point += 6 * rr;
//                     current_sub -= 6 * rr;
//                     student_mark += 1;
//                   }
//                   studnt_mark[sub + " points"] = current_point;
//                   studnt_mark[sub + " mark"] = student_mark;
//                 } else {
//                   let current_sub = parseInt(
//                     (student_theory_mark + rp_balance) / theory
//                   );
//                   rp_balance = (student_theory_mark + rp_balance) % theory;

//                   let current_point = 0;
//                   if (5 * rr <= current_sub) {
//                     current_point += 5 * rr;
//                     current_sub -= 5 * rr;
//                     student_mark += 5;
//                   } else {
//                     for (let i = 5; i != 0; i--) {
//                       if (current_sub >= i * rr) {
//                         current_point += i * rr;
//                         current_sub -= i * rr;
//                         student_mark += i;
//                         rp_balance += current_sub - i * rr;
//                         break;
//                       }
//                     }
//                   }
//                   if (3 * 2 * rr <= current_sub) {
//                     current_point += 3 * 2 * rr;
//                     current_sub -= 3 * 2 * rr;
//                     student_mark += 3;
//                   } else {
//                     for (let i = 2; i != 0; i--) {
//                       if (current_sub >= i * 2 * rr) {
//                         current_point += i * 2 * rr;
//                         current_sub -= i * 2 * rr;
//                         rp_balance += current_sub - i * 2 * rr;
//                         student_mark += i;
//                         break;
//                       }
//                     }
//                   }
//                   if (2 * 4 * rr <= current_sub) {
//                     current_point += 2 * 4 * rr;
//                     current_sub -= 2 * 4 * rr;
//                     student_mark += 2;
//                   } else {
//                     for (let i = 1; i != 0; i--) {
//                       if (current_sub >= i * 4 * rr) {
//                         current_point += i * 4 * rr;
//                         current_sub -= i * 4 * rr;
//                         rp_balance += current_sub - i * 4 * rr;
//                         student_mark += i;
//                         break;
//                       }
//                     }
//                   }
//                   if (6 * rr <= current_sub) {
//                     current_point += 6 * rr;
//                     current_sub -= 6 * rr;
//                     student_mark += 1;
//                   }
//                   studnt_mark[sub + " points"] = current_point;
//                   studnt_mark[sub + " mark"] = student_mark;
//                 }
//               }
//               student_data.push(studnt_mark);
//               resolve();
//             }
//           );
//         });
//       });

//       Promise.all(promises)
//         .then(() => {
//           res.send({ message: student_data });
//         })
//         .catch((error) => {
//           console.error(error);
//           res.status(500).send("An error occurred.");
//         });
//     }
//   );
// });

//testing

// app.get("/internal_rp", function (req, res) {
//   const mark = {
//     mathamatics: "theory",
//     physics: "theory",
//     chemistry: "lab",
//     electronics: "lab",
//     computing: "lab",
//   };

//   let lab = 0;
//   let theory = 0;

//   for (let sub in mark) {
//     if ("lab" === mark[sub]) {
//       lab++;
//     } else {
//       theory++;
//     }
//   }

//   const lab_percentage = lab / (lab + theory);
//   const theory_percentage = theory / (lab + theory);

//   con.query(
//     "SELECT user_id FROM student_details WHERE department = (SELECT department_id FROM department WHERE department_name='CSE' AND year=1);",
//     function (err, result) {
//       if (err) throw err;

//       let rr = 3;

//       for (let key in result) {
//         if (result.hasOwnProperty(key)) {
//           con.query("SELECT balance FROM student_rp_gatered WHERE user_id=" + result[key].user_id, function (err, result) {
//             if (err) throw err;

//             let balance = result[0].balance;
//             console.log(balance, "-");

//             let student_lab_mark = parseInt(lab_percentage * balance);
//             let student_theory_mark = parseInt(theory_percentage * balance);
//             console.log(student_lab_mark, student_theory_mark);

//             let rp_balance = balance - (student_lab_mark + student_theory_mark);

//             for (let sub in mark) {
//               let current_sub, current_point = 0;

//               if ("lab" === mark[sub]) {
//                 current_sub = parseInt((student_lab_mark + rp_balance) / lab);
//                 rp_balance = ((student_lab_mark + rp_balance) % lab);

//                 // Calculate current_point for lab subjects
//                 if (8 * rr < current_sub) {
//                   current_point += 8 * rr;
//                   current_sub -= 8 * rr;
//                 } else {
//                   for (let i = 8; i !== 0; i--) {
//                     if (current_sub >= i * rr) {
//                       current_point += i * rr;
//                       current_sub -= i * rr;
//                       rp_balance += current_sub - i * rr;
//                       break;
//                     }
//                   }
//                 }
//                 // More logic for lab subjects
//               } else {
//                 current_sub = parseInt((student_theory_mark + rp_balance) / theory);
//                 rp_balance = ((student_theory_mark + rp_balance) % theory);

//                 // Calculate current_point for theory subjects
//                 if (5 * rr < current_sub) {
//                   current_point += 5 * rr;
//                   current_sub -= 5 * rr;
//                 } else {
//                   for (let i = 5; i !== 0; i--) {
//                     if (current_sub >= i * rr) {
//                       current_point += i * rr;
//                       current_sub -= i * rr;
//                       rp_balance += current_sub - i * rr;
//                       break;
//                     }
//                   }
//                 }
//                 // More logic for theory subjects
//               }

//               console.log(sub, " ", current_point);
//             }
//           });
//         }
//       }
//     }
//   );
//   res.send({ message: "success" });
// });
async function getEmailsForEvent(eventId) {
  const [rows] = await con.execute(
    `SELECT s.email
       FROM login s
       JOIN registered_events r ON s.user_id = r.user_id
       where r.Event_id=?`,
    [eventId],
    (err, result) => {
      return result;
    }
  );

  return rows.map((row) => row.email);
}

// Async function to send email
async function sendEmail(recipients, subject, body) {
  try {
    await transporter.sendMail({
      from: '"Event Manager" <navaneethakrishnan.cs23@bitsathy.ac.in>',
      to: recipients, // Array of email addresses
      subject: subject,
      text: body, // Plain text body
      html: `<p>${body}</p>`, // HTML body (optional)
    });

    console.log("Emails sent successfully");
  } catch (error) {
    console.error("Error sending emails:", error);
  }
}

// Function to get emails of students registered for an event
function getEmailsForEvent(eventId, callback) {
  con.query(
    `SELECT s.email
       FROM login s
       JOIN registered_events r ON s.user_id = r.user_id
       where r.Event_id=?`,
    [eventId],
    (err, results) => {
      if (err) throw err;
      const emails = results.map((row) => row.email);
      callback(emails); // Use callback to return emails
    }
  );
}

// Function to schedule email 30 minutes before each event
function scheduleEmailsForAllEvents() {
  // Get all events that are starting more than 30 minutes from now
  con.query(
    `SELECT event_id, Activity_name, StartDate
         FROM event_details
         WHERE StartDate > NOW()`, // Adjust for timezone if necessary
    (err, events) => {
      if (err) throw err;

      const currentTime = new Date();
      console.log(events);
      events.forEach((event) => {
        const eventStartTime = new Date(event.StartDate);

        // Calculate the time 30 minutes before the event starts
        const emailTime = new Date(eventStartTime.getTime() - 1 * 60000);

        // Calculate the delay for scheduling (in milliseconds)
        const delay = emailTime.getTime() - currentTime.getTime();
        console.log(delay);
        if (delay > 0) {
          // Schedule the email for this event
          setTimeout(() => {
            getEmailsForEvent(event.event_id, (emails) => {
              if (emails.length > 0) {
                console.log(emails);
                const subject = `Reminder: ${event.Activity_name} is starting in 30 minutes!`;
                const body = `Dear students, the event "${event.Activity_name}" will begin in 30 minutes. Please be prepared.`;
                sendEmail(emails, subject, body);
              } else {
                console.log(
                  `No students registered for event ${event.Activity_name}.`
                );
              }
            });
          }, delay);
        } else {
          console.log(
            `Event "${event.Activity_name}" is already within 30 minutes or has passed.`
          );
        }
      });
    }
  );

  // Close the connection after querying
}

// Schedule a cron job to check for upcoming events every minute
cron.schedule("* * * * *", () => {
  console.log("Checking for upcoming events...");
  scheduleEmailsForAllEvents();
});

app.listen(5001, function () {
  console.log("Server is running on port 5000");
});
