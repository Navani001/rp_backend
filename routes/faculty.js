const express = require("express");
const {
  r,
  teamapproveforevent,
  teamapprove,
  attendenceapprove,
  studentapprove,
  close_event,
  present,
  closeregistration,
  openregistration,
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
} = require("../controllers/facultycontoller");
const router = express.Router();
const authenticateToken = require("../middlewares/jwt.js");

router.get("/r", authenticateToken, r);
router.post("/r", authenticateToken, r_post);
router.post("/Event_id", authenticateToken, Event_ID);
router.post("/attendence", authenticateToken, Attendence);
router.post("/task", authenticateToken, Task);
router.post("/sumbittask", authenticateToken, sumbitTask);
router.post("/present", authenticateToken, present);
router.post("/openregistration", authenticateToken, openregistration);
router.post("/close_event", authenticateToken, close_event);
router.post("/closeregistration", authenticateToken, closeregistration);
router.post("/attendenceapprove", authenticateToken, attendenceapprove);
router.post("/studentapprove", authenticateToken, studentapprove);
router.post("/teamapprove", authenticateToken, teamapprove);
router.post("/teamapproveforevent", authenticateToken, teamapproveforevent);
router.post("/teamMembers", authenticateToken, teamMembers);
router.post("/teamapproveattendence", authenticateToken,teamapproveattendence);
router.post("/teamapproveattendence2", authenticateToken,teamapproveattendence2);
router.post("/teamapproveattendencestudent", authenticateToken,teamapproveattendencestudent);
router.post("/teammemberpresent", authenticateToken,teammemberpresent);
router.post("/updatetask", authenticateToken,updatetask);
router.post("/inserttask", authenticateToken,inserttask);
router.post("/getstudentdocument", authenticateToken,getstudentdocument);
router.post("/approvetheteam", authenticateToken,approvetheteam);
router.post("/approvethewholeteam", authenticateToken,approvethewholeteam);
router.get("/event-team-details/:team_id", authenticateToken,eventteamdetails);
module.exports = router;
