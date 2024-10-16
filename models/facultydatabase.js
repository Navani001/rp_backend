const { callbackPromise } = require("nodemailer/lib/shared/index.js");
const con = require("./db.js");
const Task_database = (iD, callback) => {
  const sql =
    "select task_id,point_Name,max_point,user_id from points_event pe join registered_events re on re.Event_id=pe.Event_id where pe.Event_id=?";
  const sql2 =
    "SELECT re.user_id,pe.point_Name,pe.max_point,COALESCE(ps.point, -1) AS point_obtained,pe.task_id,level FROM registered_events re INNER JOIN points_event pe ON pe.event_id = re.event_id LEFT JOIN points_students ps ON pe.task_id = ps.task_id AND re.user_id = ps.student_id WHERE re.Event_id = ?";
  con.query(sql2, [iD], (err, result) => {
    if (err) {
      return callback(err);
    }

    callback(null, result);
  });
};

getstudentdocument_database = (event_id, callback) => {
  const sql =
    "select l.user_id,l.username,l.rollno,r.document,r.approvethedocument,d.department_name,d.year from registered_events re join login l on re.user_id =l.user_id join department d on d.department_id=l.department_id join report r on r.event_id=re.Event_id and r.user_id=re.user_id  where r.event_id=?";
  con.query(sql, [event_id], (err, result) => {
    if (err) {
      console.log(err);
      callback(err);
    }

    callback(null, result);
  });
};
const eventteamdetails_database = (team_id, callback) => {
  const sql =
    "select * from event_details ed left join registered_events re on re.Event_id=ed.Event_id join team_details td on re.teamid=td.teamid where td.teamid=?";

  con.query(sql, [team_id], (err, result) => {
    if (err) {
      console.log(err);
      callback(err);
    }

    callback(null, result);
  });
};
const updatetask_database = (point, task_id, student_id, callback) => {
  const sql2 =
    "UPDATE points_students SET point = ? WHERE task_id = ? AND student_id = ?";
  console.log(point, task_id, student_id);
  con.query(sql2, [point, task_id, student_id], (err, result) => {
    if (err) {
      console.log(err);
      callback(err);
    }
    console.log("hi");
    console.log(result);
    callback(null, result);
  });
};
const inserttask_database = (task, callback) => {
  const sql =
    "insert into points_students(point,task_id,student_id) values " + task;
  con.query(sql, [task], (err, result) => {
    if (err) {
      console.log(err);
      callback(err);
    }
    console.log("hi");
    callback(null, result);
  });
};
const closeregistration_database = (id, callback) => {
  const sql =
    'UPDATE `brp6`.`event_details` SET `status` = "4" WHERE `Event_id` = ?';
  con.query(sql, [id], (err, result) => {
    console.log("closed registration updated");
    callback(null, result);
  });
};
const teammemberabsent_database = (user_id, team_id, callback) => {
  console.log("hiabsent");
  const sql =
    "update registered_events set present=present-1 where user_id=? and teamid=?";
  con.query(sql, [user_id, team_id], (err, result) => {
    if (err) {
      callback(err);
    }
    console.log(result);
    callback(null, result);
  });
};

const teammemberpresent_database = (user_id, team_id, callback) => {
  console.log("hi");
  const sql =
    "update registered_events set present=present+1 where user_id=? and teamid=?";
  con.query(sql, [user_id, team_id], (err, result) => {
    if (err) {
      console.log(err);
      callback(err);
    }
    console.log(result);
    callback(null, result);
  });
};
const teamapproveattendence_database = (id, callback) => {
  const sql =
    "select * from team_details td where td.event_id=? and td.active=1";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      callback(err);
    }

    callback(null, result);
  });
};
const teamapproveattendence2_database = (id, callback) => {
  const sql =
    "select * from team_details td join report r on r.team_id=td.teamid where td.event_id=? and td.active=1";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      callback(err);
    }

    callback(null, result);
  });
};
const teamapproveforevent_database = (id, callback) => {
  const sql = "update team_details set active=1 where teamid=?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      callback(err);
    }
  });
  const sql2 = "update registered_events set approved=1 where teamid=?";
  con.query(sql2, [id], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};
const openregistration_database = (iD, callback) => {
  const sql =
    'UPDATE `brp6`.`event_details` SET `status` = "3" WHERE `Event_id` = ?';
  con.query(sql, [iD], (err, result) => {
    if (err) {
      return callback(err);
    }
    console.log("open registration updated");
    callback(null, result);
  });
};
const close_event_database = (iD, callback) => {
  const sql =
    'UPDATE `brp6`.`event_details` SET `status` = "8" WHERE `Event_id` = ?';
  con.query(sql, [iD], (err, result) => {
    if (err) {
      return callback(err);
    }
    console.log("event closed");
    callback(null, result);
  });
};
const present_database = (iD, text, callback) => {
  // const sql='UPDATE `brp6`.`registered_events` SET `present` = 1 WHERE user_id in (?)and Event_id=?'
  // con.query(sql,[text,iD],(err,result)=>{
  //     if (err) {
  //         return callback(err);
  //     }
  //     console.log("student attendence added");

  // })
  const sql2 =
    'UPDATE `brp6`.`event_details` SET `status` = "5" WHERE `Event_id` =?';
  con.query(sql2, [iD], (err, result) => {
    console.log("Attendence Updated");
    callback(null, result);
  });
};
const sumbitTask_database = (text, iD, callback) => {
  const sql2 =
    'UPDATE `brp6`.`event_details` SET `status` = "6" WHERE `Event_id` = ?';
  con.query(sql2, [iD], (err, result) => {
    if (err) {
      console.err(err);
      return callback(err);
    }
    console.log("Task Updated");
    con.query(sql2, [iD], (err, result) => {
      if (err) {
        console.err(err);
        return callback(err);
      }
      console.log("Task Updated");
      callback(null, result);
    });
  });
};
const r_database = (user_id, callback) => {
  const sql = "SELECT pc.* FROM event_details pc WHERE pc.faculty_id = ?";
  con.query(sql, [user_id], (err, result) => {
    if (err) {
      return callback(err);
    }
    console.log("i am at point table");
    callback(null, result);
  });
};
const r_post_database = (event_id, callback) => {
  const sql =
    'SELECT StartDate,EndDate,No_of_students_expected,points as "maximumPoint",Activity_name,Activity_code FROM brp6.event_details where Event_id= ?';
  con.query(sql, [event_id], (err, result) => {
    if (err) {
      return callback(err);
    }
    console.log("i am at point table");
    callback(null, result);
  });
};
const Event_ID_database = (iD, callback) => {
  const sql =
    "select Activity_type,Activity_name,Activity_code from event_details where Event_id=?";
  con.query(sql, [iD], (err, result) => {
    if (err) {
      return callback(err);
    }

    callback(null, result);
  });
};
const Attendence_database = (iD, callback) => {
  const sql =
    "select re.user_id,re.present,l.username,d.department_name,d.year,l.rollno,ed.status from registered_events re join report r on r.user_id=re.user_id  join login l on l.user_id=re.user_id join department d on l.department_id=d.department_id join event_details ed on re.Event_id=ed.Event_id where ed.Event_id=? and re.approved=1 and r.approvethedocument=1";
  con.query(sql, [iD], (err, result) => {
    if (err) {
      return callback(err);
    }
    console.log(result);
    callback(null, result);
  });
};

const attendenceapprove_database = (iD, callback) => {
  const sql =
    "select re.user_id,l.username,d.department_name,d.year,l.rollno,ed.status,pse.level from registered_events re join login l on l.user_id=re.user_id join department d on l.department_id=d.department_id join event_details ed on re.Event_id=ed.Event_id join ps_students_events pse on pse.student_id=re.user_id where ed.Event_id= ? and pse.ps_event_id=1 and re.approved=0";
  con.query(sql, [iD], (err, result) => {
    if (err) {
      callback(err);
    }
    console.log("i am at attenddence approve");
    callback(null, result);
  });
};
const studentapprove_database = (student_id, event_id, callback) => {
  const sql =
    "update registered_events set approved=1 where user_id=? and Event_id= ?";
  con.query(sql, [student_id, event_id], (err, result) => {
    if (err) {
      callback(err);
    }
    console.log("i am at stydent approve");
    callback(null, result);
  });
};
const teamapprove_database = (id, callback) => {
  const sql = "select * from team_details where event_id=? and active=0";
  con.query(sql, [id], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};
const team_member_details_database = (id, callback) => {
  const sql =
    "select l.username,l.email,l.rollno,d.department_name,d.year,re.iscaptain from registered_events re join login l on l.user_id=re.user_id join department d on l.department_id=d.department_id where re.teamid=?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};
const teamapproveattendencestudent_database = (id, callback) => {
  const sql =
    "select l.username,l.user_id,l.email,l.rollno,d.department_name,d.year,re.present from registered_events re join login l on l.user_id=re.user_id join department d on l.department_id=d.department_id where re.teamid=?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};
const approvetheteam_database = (change, event_id, student, callback) => {
  const sql =
    "update report set approvethedocument= ? where user_id=? and event_id=?";
  con.query(sql, [change, student, event_id], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};
const approvethewholeteam_database = (team_id, change, callback) => {
  console.log(change)
  const sql = "update report set approvethedocument= ? where team_id=?";
  con.query(sql, [change, team_id], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};
module.exports = {
  teammemberabsent_database,
  teammemberpresent_database,
  teamapproveattendencestudent_database,
  teamapproveattendence_database,
  team_member_details_database,
  teamapproveforevent_database,
  teamapprove_database,
  studentapprove_database,
  attendenceapprove_database,
  closeregistration_database,
  close_event_database,
  openregistration_database,
  present_database,
  sumbitTask_database,
  Task_database,
  r_database,
  r_post_database,
  Event_ID_database,
  Attendence_database,
  inserttask_database,
  updatetask_database,
  eventteamdetails_database,
  approvetheteam_database,
  getstudentdocument_database,
  teamapproveattendence2_database,
  approvethewholeteam_database,
};
