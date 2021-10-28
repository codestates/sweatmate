const express = require("express");
const router = express.Router();
const { getGatheringList, getGatheringOfUser } = require("../controllers/gathering");
const { createConditionsForSearching, isAuth, checkPermission } = require("../middlewares");
//TODO: 미들웨어에서 sportName => id 로 변환
router.get("/", createConditionsForSearching, getGatheringList);
router.post("/", (_, res) => {
  res.status(200).send("일정 생성 라우터");
});
router.patch("/", (_, res) => {
  res.status(200).send("일정 종료 라우터");
});
router.get("/random", (_, res) => {
  res.status(200).send("일정 랜덤 조회 라우터");
});
router.get("/upcoming/:userId", isAuth, checkPermission, getGatheringOfUser);
router.get("/passed/:userId", isAuth, checkPermission, getGatheringOfUser);
module.exports = router;
