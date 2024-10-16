const {
  adminRubricApprove_database,
  adminRubricUpdate_database,
  pending_database,
  PointsApproved_database,
  pointreport_database,
  report_database,
  approve_database,
  event_approved_database,
  event_rejected_database,
  pointreportforteam_database
} = require("../models/admindatabase.js");
const con = require("../models/db.js");
const pointreportforteam=(req,res)=>{
  var teamid=req.body.teamid
  var eventid=req.body.eventid
  pointreportforteam_database(teamid,eventid,(err,result)=>{
    if (err) return res.status(500).json({ error: "error at reject" });
    res.send({ message: result });
  })

}
const event_rejected = (req, res) => {
  var iD = req.body.id;
  var details = req.body.details;
  event_rejected_database(iD, details, (err, result) => {
    if (err) return res.status(500).json({ error: "error at reject" });
    res.send({ message: result });
  });
};
const adminRubricUpdate = (req, res) => {
  var text = req.body.Text;
  adminRubricUpdate_database(text, (err, result) => {
    if (err) return res.status(500).json({ error: "error at reject" });
    res.send({ message: result });
  });
};
const adminRubricApprove = (req, res) => {
  student_id = req.body.student_id;
  console.log(req.body);
  Event_id = req.body.Event_id;

  adminRubricApprove_database(Event_id, student_id, (err, result) => {
    if (err) return res.status(500).json({ error: "error at reject" });
    res.send({ message: result });
  });
};
const pending = (req, res) => {
  var iD = req.body.id;
  pending_database(iD, (err, result) => {
    if (err) return res.status(500).json({ error: "error at pending" });
    res.send({ message: result });
  });
};
function updateStudentPoints(id, points) {
  // SQL query with placeholders
  const sql = `
        UPDATE student_rp_gatered
        SET total = total + ?,
            balance = balance + ?
        WHERE user_id = ?
    `;

  // Execute the query
  con.query(sql, [points, points, id], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return;
    }
    console.log("Query executed successfully:", results);
  });
}
const PointsApproved = (req, res) => {
  var event_id = req.body.id;

  PointsApproved_database(event_id, (err, result) => {
    console.log("i am at pointsApproved");
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    result.map((point) => {
      console.log(point.points, point.student_id);
      updateStudentPoints(point.student_id, point.points);
    });
    res.send({ message: result });
  });
};
const pointreport = (req, res) => {
  event_id = req.body.id;
  pointreport_database(event_id, (err, result) => {
    if (err)
      return res.status(500).json({ errr: "error fetching point report" });
    res.send({ message: result });
  });
};
const report = (req, res) => {
  report_database((err, result) => {
    if (err) return res.status(500).json({ error: "fetching at report error" });

    res.send({ message: result });
  });
};
const approve = (req, res) => {
  approve_database((err, result) => {
    console.log(result);
    if (err) return res.status(500).json({ error: "error fetchng approve" });
    res.send({ message: result });
  });
};
const event_approved = (req, res) => {
  var id = req.body.id;
  event_approved_database(id, (err, result) => {
    if (err)
      return res.status(500).json({ error: "error fetching event approved" });
    res.send({ message: result });
  });
};
module.exports = {
  adminRubricApprove,
  adminRubricUpdate,
  pending,
  event_rejected,
  PointsApproved,
  pointreport,
  report,
  approve,
  event_approved,
  pointreportforteam
};
