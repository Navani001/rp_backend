const express = require("express");
const router = express.Router();
const {
  team_member_details,
  eventteamdetails,
  notifications,
  getPointTable,
  cart_data,
  teamregister,
  reward_table,
  reward_distributed,
  mark_distributed,
  dr,
  register,
  registerEvent,
  team_memeber_ddd,

  approved
} = require("../controllers/studentcontroller.js");
const authenticateToken = require("../middlewares/jwt.js");

router.get("/bar", authenticateToken, cart_data);
router.get("/rewardtable", authenticateToken, reward_table);
router.get("/rewarddistributed", authenticateToken, reward_distributed);
router.get("/rewardinternal", authenticateToken, mark_distributed);
router.get("/dr", authenticateToken, dr);
router.get("/register", authenticateToken, register);
router.post("/changeregister", authenticateToken, registerEvent);
router.post("/event-team-member-details/approve", authenticateToken,approved);
router.get("/pointtable", authenticateToken, getPointTable);
router.get("/notifications", authenticateToken, notifications);
router.get(
  "/event-team-details/:event_id",
  authenticateToken,
  eventteamdetails
);
router.get(
  "/event-team-member-details/:team_id",
  authenticateToken,
  team_member_details
);
router.post("/teamregister", authenticateToken, teamregister);
router.post("/event-team-details-add", authenticateToken, team_memeber_ddd);


module.exports = router;
