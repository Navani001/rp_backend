const {
  teamapproveforevent_database,
  studentapprove_database,
  attendenceapprove_database,
  close_event_database,
  closeregistration_database,
  present_database,
  openregistration_database,
  r_database,
  Task_database,
  r_post_database,
  Event_ID_database,
  Attendence_database,
  sumbitTask_database,
  teamapprove_database,
  team_member_details_database,
  teamapproveattendence_database,
  teammemberabsent_database,
  teammemberpresent_database,
  teamapproveattendencestudent_database,
  inserttask_database,
  updatetask_database,
  eventteamdetails_database,
  approvetheteam_database,
  teamapproveattendence2_database,
  getstudentdocument_database,
  approvethewholeteam_database
} = require("../models/facultydatabase.js");
const approvethewholeteam=(req,res)=>{
  const team_id=req.body.team_id
  const change=req.body.change
  approvethewholeteam_database(team_id,change,(err,result)=>{
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    console.log(result)
    res.send({ message: result });
  })
}
const eventteamdetails=(req,res)=>{
  const team_id= req.params.team_id
  eventteamdetails_database(team_id, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    console.log(result)
    res.send({ message: result });
  });
}
const teamapproveattendence = (req, res) => {
  const id = req.body.id;
  teamapproveattendence_database(id, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send({ message: result });
  });
};
const teamapproveattendence2 = (req, res) => {
  const id = req.body.id;
  teamapproveattendence2_database(id, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send({ message: result });
  });
};
const teamapproveattendencestudent = (req, res) => {
  const id = req.body.id;
  teamapproveattendencestudent_database(id, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send({ message: result });
  });
};
const r = (req, res) => {
  console.log("hi");
  const userId = req.user_id;
  r_database(userId, (err, result) => {
    console.log("i am at r");
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send({ message: result });
  });
};
const teamapproveforevent = (req, res) => {
  var team_id = req.body.team_id;
  teamapproveforevent_database(team_id, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send({ message: result });
  });
};
const studentapprove = (req, res) => {
  var studentid = req.body.studentid;
  var event_id = req.body.Event_id;
  studentapprove_database(studentid, event_id, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send({ message: result });
  });
};
const attendenceapprove = (req, res) => {
  console.log("iam at attendence approve controller");
  var iD = req.body.id;
  attendenceapprove_database(iD, (err, result) => {
    if (err) return res.status(500).json({ error: "attendence" });

    res.send({ message: result });
  });
};
const closeregistration = (req, res) => {
  var id = req.body.id;

  closeregistration_database(id, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send({ message: result });
  });
};
const openregistration = (req, res) => {
  var id = req.body.id;
  openregistration_database(id, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send({ message: result });
  });
};
const present = (req, res) => {
  var iD = req.body.id;
  var text = req.body.text;
  present_database(iD, text, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send({ message: result });
  });
};
const close_event = (req, res) => {
  var id = req.body.id;
  close_event_database(id, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send({ message: result });
  });
};
const sumbitTask = (req, res) => {
  var text = req.body.text;
  var iD = req.body.id;
  sumbitTask_database(text, iD, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send({ message: result });
  });
};
const r_post = (req, res) => {
  var event_id = req.body.id;
  r_post_database(event_id, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to register for event" });
    res.send({ message: result });
  });
};
const Event_ID = (req, res) => {
  var iD = req.body.id;
  Event_ID_database(iD, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });
    res.send({ message: result });
  });
};
const Attendence = (req, res) => {
  var iD = req.body.id;
  Attendence_database(iD, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });
    res.send({ message: result });
  });
};
const Task = (req, res) => {
  var iD = req.body.id;
  Task_database(iD, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });
    }
    res.send({ message: result });
  });
};
const teamapprove = (req, res) => {
  var id = req.body.id;
  teamapprove_database(id, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });
    res.send({ message: result });
  });
};
const teamMembers = (req, res) => {
  var id = req.body.id;
  team_member_details_database(id, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error starting transaction" });
    res.send({ message: result });
  });
};
const teammemberpresent = (req, res) => {
  var user_id = req.body.user_id;
  var team_id = req.body.team_id;
  var presentorabsent = req.body.decision;
  console.log(presentorabsent);
  if (presentorabsent) {
    teammemberpresent_database(user_id, team_id, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
    });
  } else {
    teammemberabsent_database(user_id, team_id, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "Database error starting transaction" });
      }
      console.log(result);
    });
  }
  res.send({ message: "success" });
};
const inserttask = (req, res) => {
  var task = req.body.task;
  console.log("hi i am at insert", task);
    inserttask_database(task, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);

      res.send({ message: result });
    });
};
const updatetask = (req, res) => {
  console.log(req.body.task);
  // Parse the string into an array of arrays
  const tuplesString = req.body.task;

  // Function to parse the tuples string into an array of arrays
  function parseTuples(tuplesString) {
    return tuplesString
      .slice(1, -1) // Remove the outer parentheses
      .split("),(") // Split by "),("
      .map((tuple) =>
        tuple
          .split(",") // Split each tuple by comma
          .map((value) => parseInt(value))
      ); // Convert to integers
  }

  // Initialize tuples
  const tuples = parseTuples(tuplesString);

  console.log("Parsed tuples:", tuples);

  tuples.forEach(([point, task_id, student_id]) => {
    updatetask_database(point, task_id, student_id, (err, result) => {
      if (err) {
        console.log(err);
      }
    
    });
    res.send({ message: "success" });
  });
};
const getstudentdocument=(req,res)=>{
  const event_id=req.body.id
  getstudentdocument_database(event_id,(err,result)=>{
    if (err) {
      console.log(err);
    }
    res.send({message:result})
  })
}
const approvetheteam=(req,res)=>{
  const event_id=req.body.event_id
  const student_id=req.body.user_id
  const change=req.body.change
  approvetheteam_database(change,event_id,student_id,(err,result)=>{

    if (err) {
      console.log(err);
    }
    res.send({message:result})
  })
}
module.exports = {
  teamapproveforevent,
  teamapprove,
  studentapprove,
  attendenceapprove,
  closeregistration,
  close_event,
  openregistration,
  present,
  r,
  r_post,
  Event_ID,
  Attendence,
  Task,
  sumbitTask,
  teamMembers,
  teamapproveattendence,
  teamapproveattendencestudent,
  teammemberpresent,
  inserttask,
  updatetask,
  eventteamdetails,
  getstudentdocument,
  approvetheteam,
  teamapproveattendence2,
  approvethewholeteam
};
