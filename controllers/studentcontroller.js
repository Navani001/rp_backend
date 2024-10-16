const {
  
  team_memeber_ddd_database,
  team_member_details_database,
  eventteamdetails_database,
  teamregister_database,
  notifications_database,
  getPointTableDatabase,
  changeRegister_database,
  registerForEvent,
  cart_data_database,
  reward_table_database,
  rewarddistributed_database,
  markdistributed_database,
  dr_database,
  register_database,
  approved_database
} = require("../models/studentdatabase.js");
const { studentapprove } = require("./facultycontoller.js");
const dr = (req, res) => {
  const userId = req.user_id;
  dr_database(userId, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });
    res.send({ message: result });
  });
};
const approved=(req,res)=>{
  const userId = req.user_id;
  const event_id = req.body.event_id;
  const team_id = req.body.team_id;
  
  approved_database(
    userId,
    event_id,
    team_id,
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Failed to register for event" });
      res.send("Success!");
    }
  );
}
const eventteamdetails = (req, res) => {
  const userId = req.user_id;
  const event_id = req.params.event_id;
  console.log(event_id);
  console.log("i am at correct location")
  eventteamdetails_database(userId, event_id, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });
    console.log(result);
    res.send({ message: result });
  });
};
const teamregister = (req, res) => {
  const userId = req.user_id;
  const event_id = req.body.event_id;
  const team_name = req.body.team_name;
  const description = req.body.description;
  const title = req.body.title;
  const team_size = req.body.team_size;
  teamregister_database(
    userId,
    event_id,
    team_name,
    description,
    title,
    team_size,
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Failed to register for event" });
      res.send("Success!");
    }
  );
};
const notifications = (req, res) => {
  const userId = req.user_id;
  notifications_database(userId, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send("Success!");
  });
};
const changeRegister = (req, res) => {
  const userId = req.user_id;
  const eventId = req.body.id;
  changeRegister_database(userId, eventId, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send("Success!");
  });
};
const getPointTable = (req, res) => {
  var detai = [];
  const userId = req.user_id;
  getPointTableDatabase(userId, (err, result) => {
    result.forEach((r) => {
      detai.push({
        id: r.Event_id,
        Date: r.StartDate,
        team_size: r.team_size,
        Activity_code: r.Activity_code,
        Activity_name: r.Activity_name,
        Tpye: r.Activity_type,
        Activity_type: r.Activity_category,
        points: r.points,
        Organier: r.Organizer,
        seat: r.Availability,
        descr: r.description,
      });
    });

    res.send({ message: detai });
  });
};
const registerEvent = (req, res) => {
  const eventId = req.body.event_id;
  const userId = req.user_id;

  registerForEvent(userId, eventId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to register for event" });
    }
    res.send("Success!");
  });
};
const cart_data = (req, res) => {
  const userId = req.user_id;

  console.log(userId);

  cart_data_database(userId, (err, result) => {
    if (err){
      console.log(err)
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });}
    res.send({ message: result });
  });
};
const reward_table = (req, res) => {
  const userId = req.user_id;
  reward_table_database(userId, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });
    const originalData = result;

    const tabledata = [
      { category: "technical-events", count: 0, points: 0.0 },
      { category: "Skills", count: null, points: 0.0 },
      { category: "Assignments", count: 0, points: 0.0 },
      { category: "Interview", count: 0, points: 0.0 },
      { category: "technical-society", count: 0, points: 0.0 },
      { category: "Product Development", count: null, points: 0.0 },
      { category: "TAC", count: null, points: 0.0 },
      { category: "Special Lab Initiatives", count: 0, points: 0.0 },
      { category: "extra-curricular", count: 0, points: 0.0 },
      { category: "Student Initiatives", count: null, points: 0.0 },
      { category: "external-technical", count: null, points: 0.0 },
      {
        category: "REWARD POINTS FROM HONOR POINTS",
        count: null,
        points: 0.0,
      },
      { category: "Total", count: null, points: 0.0 },
     
    ];

    // Create a mapping from originalData
    const dataMap = originalData.reduce((map, item) => {
      map[item.Activity_type] = {
        count: item.Count,
        points: item.TotalPoints,
      };
      return map;
    }, {});

    // Update tabledata based on dataMap
    const updatedTableData = tabledata.map((item) => {
      const data = dataMap[item.category];
      return {
        ...item,
        count:
          item.count === null ? item.count : data ? data.count : item.count,
        points: data ? data.points : item.points,
      };
    });

    res.send({ message: updatedTableData });
  });
};
const reward_distributed = (req, res) => {
  sno = 1;
  var d = [];
  ip1_t = 0;
  ip2_t = 0;
  const userId = req.user_id;

  overall_t = 0;
  rewarddistributed_database(userId, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });
    result.forEach((r) => {
      ip1_t = r.ip1 + ip1_t;
      ip2_t = r.ip2 + ip2_t;
      overall_t = r.ip1 + r.ip2 + overall_t;
      d.push({
        sno: sno,
        subject: r.subject,
        ip1: r.ip1,
        ip2: r.ip2,
        total: r.ip1 + r.ip2,
      });
      sno = sno + 1;
    });
    d.push({
      sno: "lab subject",
      subject: NaN,
      ip1: NaN,
      ip2: NaN,
      total: NaN,
    });
    d.push({
      sno: "total",
      subject: "5",
      ip1: ip1_t,
      ip2: ip2_t,
      total: overall_t,
    });
    res.send({ message: d });
  });
};
const mark_distributed = (req, res) => {
  sno = 1;
  var d = [];
  ip1_t = 0;
  ip2_t = 0;
  const userId = req.user_id;

  overall_t = 0;
  markdistributed_database(userId, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });
    result.forEach((r) => {
      ip1_t = r.ip1 + ip1_t;
      ip2_t = r.ip2 + ip2_t;
      overall_t = r.ip1 + r.ip2 + overall_t;
      d.push({
        sno: sno,
        subject: r.subject,
        ip1: r.ip1,
        ip2: r.ip2,
        total: r.ip1 + r.ip2,
      });
      sno = sno + 1;
    });
    d.push({
      sno: "lab subject",
      subject: NaN,
      ip1: NaN,
      ip2: NaN,
      total: NaN,
    });
    d.push({
      sno: "total",
      subject: "5",
      ip1: ip1_t,
      ip2: ip2_t,
      total: overall_t,
    });
    res.send({ message: d });
  });
};
const register = (req, res) => {
  var detai = [];
  const userId = req.user_id;
  register_database(userId, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });
    result.forEach((r) => {
      detai.push({
        id: r.Event_id,
        Date: r.StartDate,
        team_size: r.team_size,
        Activity_code: r.Activity_code,
        Activity_name: r.Activity_name,
        Tpye: r.Activity_type,
        Activity_type: r.Activity_category,
        points: r.points,
        Organier: r.Organizer,
        seat: r.Availability,
        descr: r.description,
        status: r.status,
        duration:r.duration,
        endDate:r.EndDate,
        psSkillName:r.ps_event_name,
        psSkilllevel:r.levell

      });
    });

    res.send({ message: detai });
  });
};
const team_memeber_ddd = (req, res) => {
  
  const event_id = req.body.eventid;
  const team_id = req.body.team_id;
  const rollno = req.body.roll;
  console.log(event_id, team_id, rollno);
  team_memeber_ddd_database(event_id, team_id, rollno, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });
    res.send({ message: result });
  });
};
const team_member_details = (req, res) => {
  const user_id=req.user_id
  const team_id = req.params.team_id;
  console.log(team_id);
  team_member_details_database(team_id, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });
    console.log(user_id);
    console.log("result",result)
    const updatedResult = result.map((d) => 
      (parseInt(d.user_id) == parseInt(user_id) && parseInt(d.student_approved) == 0)
        ? { ...d, student_approved: 10 }
        : d
    );
    console.log(updatedResult);
    res.send({ message: updatedResult });
  });
};

module.exports = {
  team_member_details,
  eventteamdetails,
  teamregister,
  notifications,
  changeRegister,
  getPointTable,
  registerEvent,
  cart_data,
  reward_table,
  reward_distributed,
  mark_distributed,
  dr,
  register,
  team_memeber_ddd,
  approved,
  
};
