const express = require("express");
const {
  adminRubricApprove,
  pointreportforteam,
  adminRubricUpdate,
  PointsApproved,
  pending,
  pointreport,
  report,
  approve,
  event_approved,
  event_rejected,
} = require("../controllers/admincontroller");
const router = express.Router();
const authenticateToken = require("../middlewares/jwt.js");
router.post("/PointsApproved", authenticateToken, PointsApproved);
router.post("/pointreport", authenticateToken, pointreport);
router.get("/report", authenticateToken, report);
router.get("/approve", authenticateToken, approve);
router.post("/event_approved", authenticateToken, event_approved);
router.post("/pending", authenticateToken, pending);
router.post("/event_rejected", authenticateToken, event_rejected);
router.post("/adminRubricUpdate", authenticateToken, adminRubricUpdate);
router.post("/adminRubricApprove", authenticateToken, adminRubricApprove);
router.post("/pointreportforteam", authenticateToken, pointreportforteam);
module.exports = router;
