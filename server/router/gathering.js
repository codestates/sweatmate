const express = require("express");
const router = express.Router();
const {
  getGatheringList,
  getGatheringOfUser,
  getRandomGathering,
  createGathering,
} = require("../controllers/gathering");
const { createConditionsForSearching, isAuth, checkPermission } = require("../middlewares");

router.get("/", createConditionsForSearching, getGatheringList);
router.post("/", isAuth, createGathering);
router.patch("/", (_, res) => {
  res.status(200).send("일정 종료 라우터");
});
router.get("/:gatheringId", (req, res) => {
  res.status(200).send("일정 참여 라우터");
});
router.get("/random", getRandomGathering);
router.get("/upcoming/:userId", isAuth, checkPermission, getGatheringOfUser);
router.get("/passed/:userId", isAuth, checkPermission, getGatheringOfUser);
module.exports = router;
