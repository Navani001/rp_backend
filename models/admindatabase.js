const con = require("./db.js");
const approve_database = (callback) => {
  const sql = "SELECT * FROM brp6.event_details";
  con.query(sql, (err, result) => {
    if (err) {
      callback(err);
    }
    console.log(result);
    callback(null, result);
  });
};
const adminRubricApprove_database = (Event_id, student_id, callback) => {
  const sql =
    "select ps.point,pe.max_point,ps.task_id,ps.student_id,pe.point_Name,pe.level from points_students ps join points_event pe on ps.task_id=pe.task_id where pe.event_id=? and ps.student_id=?";
  con.query(sql, [Event_id, student_id], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};
const adminRubricUpdate_database = (text, callback) => {
  console.log(text);
  con.query(text, (err, result) => {
    if (err) {
      callback(err);
    }
    console.log(result);
  });
};
const pending_database = (iD, callback) => {
  const sql = "SELECT * FROM brp6.event_details where Event_id=?";
  con.query(sql, [iD], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};
const event_rejected_database = (iD, details, callback) => {
  const sql =
    'UPDATE `brp6`.`event_details` SET `status` = "9",event_review=? WHERE `Event_id` = ?';
  con.query(sql, [details, iD], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};
const event_approved_database = (id, callback) => {
  const sql =
    'UPDATE `brp6`.`event_details` SET `status` = "2" WHERE `Event_id` =?';

  con.query(sql, [id], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};
const PointsApproved_database = (event_id, callback) => {
  const sql =
    'UPDATE `brp6`.`event_details` SET `status` = "7" WHERE `Event_id` = ?';
  con.query(sql, [event_id], (err, result) => {
    if (err) {
      callback(err);
    }
    const sql2 =
      "UPDATE points_students SET approved = 1 WHERE task_id IN (SELECT task_id FROM points_event WHERE Event_id=?)";
    con.query(sql2, [event_id], (err, result) => {
      if (err) {
        callback(err);
      }
      console.log("Task Updated");
      const sql3 =
        "select sum(point)as points,student_id from points_students ps join points_event pe on pe.task_id=ps.task_id where pe.Event_id= ? group by student_id;";
      con.query(sql3, [event_id], (err, result) => {
        if (err) {
          callback(err);
        }
        console.log(result);
        callback(null, result);
      });
    });
  });
};
const report_database = (callback) => {
  const sql = "SELECT * FROM brp6.event_details where status=6";
  con.query(sql, (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};
const  pointreportforteam_database=(teamid,eventid,callback)=>{
  const sql='SELECT ps.student_id,SUM(ps.point) as "obtained",sum(pe.max_point) as "max",l.username,d.department_name,d.year,l.rollno FROM points_students ps JOIN points_event pe ON ps.task_id = pe.task_id  join login l on l.user_id=ps.student_id join department d on l.department_id=d.department_id join registered_events re on l.user_id=re.user_id WHERE pe.event_id = ? and re.teamid=? GROUP BY ps.student_id'
  con.query(sql,[eventid,teamid],(err,result)=>{
    if (err) {
      callback(err);
    }
    callback(null, result);
  })
}
const pointreport_database = (event_id, callback) => {
  const sql =
    'SELECT ps.student_id,SUM(ps.point) as "obtained",sum(pe.max_point) as "max",l.username,d.department_name,d.year,l.rollno FROM points_students ps JOIN points_event pe ON ps.task_id = pe.task_id  join login l on l.user_id=ps.student_id join department d on l.department_id=d.department_id WHERE pe.event_id = ? GROUP BY ps.student_id';
  con.query(sql, [event_id], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};
module.exports = {
  adminRubricApprove_database,
  adminRubricUpdate_database,
  pending_database,
  event_rejected_database,
  event_approved_database,
  approve_database,
  PointsApproved_database,
  pointreport_database,
  report_database,
  pointreportforteam_database
};
