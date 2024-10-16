const con = require("./db.js");
const teamregister_database=(userId, event_id,team_name,description,title,team_size,callback)=>{

    const sql="INSERT INTO `brp6`.`team_details`(`teamname`,`event_id`,`project_namel`,`project_desc`,`team_size`) VALUES (?,?,?,?,?)"
    con.query(sql, [team_name, event_id,title,description,team_size], (err, result) => {
        if (err) {
          return callback(err);
        }
       const sql2=' INSERT INTO Registered_Events (user_id, Event_id,teamid,student_approved,iscaptain) VALUES (?, ?,?,1,1)'
        con.query(sql2,[userId, event_id, result.insertId], (err, result) => {
            if (err) {
                return callback(err);
              }
            callback(null, result);
        }
    )
        
      });

}

const team_member_details_database=(team_id,callback)=>{
    const sql='select l.user_id,l.username,re.iscaptain,re.student_approved from registered_events re join team_details td on td.teamid=re.teamid join login l on l.user_id=re.user_id where td.teamid=?'
    con.query(sql,[team_id],(err,result)=>{
        if (err) {
          console.log(err)
            return callback(err);
        }
        callback(null, result);
    }
)
}
const eventteamdetails_database=(userId,event_id,callback)=>{
    const sql='select td.teamid,td.teamname,td.project_namel,td.project_desc,td.team_size,td.levelcompleted,ed.Activity_name,r.approvethedocument from team_details td join registered_events re on re.teamid=td.teamid left join report r on r.team_id=re.teamid join event_details ed on td.event_id =ed.Event_id where re.user_id=? and re.Event_id=?'
    con.query(sql,[userId,event_id],(err,result)=>{
        console.log(sql,[userId,event_id])
        if (err) {
            return callback(err);
        }
        console.log(result)
        callback(null, result);
    })
}
const registerForEvent = (userId, eventId, callback) => {
  console.log(userId, eventId);
  const registerEventQuery = `
      INSERT INTO Registered_Events (user_id, Event_id) 
      VALUES (?, ?)`;

  con.query(registerEventQuery, [userId, eventId], (err, result) => {
    if (err) {
      console.log(err);
      callback(err, null);
    }
    console.log("insert complete");
    // Decrease availability by 1 in event_details table
    const updateAvailabilityQuery = `
        UPDATE event_details 
        SET Availability = Availability - 1 
        WHERE event_id = ?`;

    con.query(updateAvailabilityQuery, [eventId], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      console.log("i am at change register");
      callback(null, result);
    });
  });
};

const getPointTableDatabase = (userId, callback) => {
  const sql =
    "SELECT pc.* FROM event_details pc LEFT JOIN Registered_Events re ON pc.Event_id = re.Event_id AND re.user_id =? JOIN ps_events_requirement per on per.event_id=pc.Event_id join ps_students_events pse on per.ps_event_id= pse.ps_event_id  and pse.student_id=? WHERE (re.user_id IS NULL or (re.student_approved=0 and pc.team_size>1)) and pse.ps_event_id=per.ps_event_id and per.levell<=pse.level AND pc.status = 3;";
  con.query(sql, [userId, userId], (err, result) => {
    if (err) {
      return callback(err);
    }
    console.log("i am at point table");
    callback(null, result);
  });
};
const rewarddistributed_database = (user_id, callback) => {
  const sql = "SELECT * FROM reward_distributed where user_id =?";
  con.query(sql, [user_id], (err, result) => {
    if (err) {
      return callback(err);
    }
    console.log("i am here at distribution");
    callback(null, result);
  });
};
const dr_database = (user_id, callback) => {
  sql =
    "select sum(point) As points,Activity_name,Activity_type as Tpye,Activity_category,Activity_code,Organizer as  Organier,StartDate as Date from points_students ps join points_event pe on pe.task_id=ps.task_id join event_details ed on pe.Event_id=ed.Event_id where student_id=? GROUP BY pe.Event_id";
  con.query(sql, [user_id], (err, result) => {
    if (err) {
      return callback(err);
    }

    callback(null, result);
  });
};
const cart_data_database = (user_id, callback) => {
  const sql = `
        WITH UserData AS (
            SELECT srg.total, srg.balance, srg.redeemed, d.department_name, d.year, srg.penalty, sd.user_id
            FROM student_rp_gatered srg
            JOIN login sd ON sd.user_id = srg.user_id
            join department d on sd.department_id=d.department_id
            WHERE sd.department_id = (
                SELECT sd.department_id
                FROM student_rp_gatered srg
                JOIN login sd ON sd.user_id = srg.user_id
                WHERE srg.user_id = ?
            )
        ),
        RankedData AS (
            SELECT *, AVG(total) OVER () AS AverageRP, COUNT(total) OVER () AS count, RANK() OVER (ORDER BY balance DESC) AS Position
            FROM UserData
        )
        SELECT total AS TotalRP, AverageRP, redeemed, penalty, Position, count
        FROM RankedData
        WHERE user_id = ?`;

        

  con.query(sql, [user_id, user_id], (err, result) => {
    if (err) {
      return callback(err);
    }
   
    callback(null, result);
  });
};
const reward_table_database = (user_id, callback) => {
  const sql =
    "WITH UserData AS(select sum(point) As points,pe.Event_id,Activity_name,Activity_type as Tpye,Activity_category,Activity_code,Organizer as  Organier,StartDate as Date from points_students ps join points_event pe on pe.task_id=ps.task_id join event_details ed on pe.Event_id=ed.Event_id where student_id=    ? and ps.approved=1 GROUP BY pe.Event_id)SELECT COALESCE(e.Activity_type, 'Total') AS Activity_type,count(Activity_type) AS Count,SUM(pc.points) AS TotalPoints FROM event_details e JOIN UserData pc ON pc.event_id = e.event_id GROUP BY e.Activity_type WITH ROLLUP;";
  con.query(sql, [user_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};
const markdistributed_database = (user_id, callback) => {
  const sql = "SELECT * FROM mark_distributed where user_id =?";
  con.query(sql, [user_id], (err, result) => {
    if (err) {
      return callback(err);
    }

    callback(null, result);
  });
};
const register_database = (user_id, callback) => {
  const sql =
    "SELECT pc.* FROM event_details pc JOIN Registered_Events re ON pc.Event_id = re.Event_id WHERE re.user_id = ? and student_approved!=-1";
    const sql2="SELECT pc.*,pe.ps_event_name,per.levell FROM event_details pc left join ps_events_requirement per on per.event_id=pc.Event_id left join ps_events pe on pe.ps_event_id = per.ps_event_id JOIN Registered_Events re ON pc.Event_id = re.Event_id WHERE re.user_id = ? and student_approved!=-1"
  con.query(sql2, [user_id], (err, result) => {
    console.log("i am at regiter");
    if (err) {
      return callback(err);
    }

    callback(null, result);
  });
};
const notifications_database = (userId, callback) => {
  const query =
    "(SELECT e.StartDate, e.Activity_name, e.Activity_code, 'point added' AS type FROM points_collected p JOIN event_details e ON e.Event_id = p.Event_id WHERE user_id = ? UNION ALL SELECT e.StartDate, e.Activity_name, e.Activity_code, 'registered' AS type FROM registered_events re JOIN event_details e ON re.Event_id = e.Event_id WHERE user_id = ?) ORDER BY StartDate";

  con.query(query, [userId, userId], function (err, result) {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};
const team_memeber_ddd_database=(event_id,team_id,rollno,callback)=>{
    const sql='insert into registered_events (user_id,event_id,teamid) values((select user_id from login where rollno=?) ,?,?)'
    con.query(sql,[rollno,event_id,team_id],function(err,result){
        if(err){
            callback(err)
        }
        callback(null,result)
    })
}
const approved_database=(userId,
  event_id,
  team_id,callback)=>{
    const sql1='UPDATE registered_events SET student_approved=1 where user_id=? and event_id=?'
    con.query(sql1,[userId,event_id],function(err,result){
      
        if(err){
          console.log(err)
            callback(err)
        }
    })
  
    const sql2='UPDATE registered_events SET student_approved=1 where user_id=? and event_id=? and teamid=?'
    con.query(sql2,[userId,event_id,team_id],function(err,result){
        if(err){
          console.log(err)
            callback(err)
        }
        callback(null,result)
    })
  }
module.exports = {
    team_memeber_ddd_database,
  notifications_database,
  getPointTableDatabase,
  registerForEvent,
  cart_data_database,
  reward_table_database,
  rewarddistributed_database,
  markdistributed_database,
  dr_database,
  register_database,
  teamregister_database,
  eventteamdetails_database,
  team_member_details_database,
  approved_database
};
