const express = require("express");
const router = express.Router();
const {
  getGatheringList,
  getGatheringOfUser,
  getRandomGathering,
  createGathering,
} = require("../controllers/gathering");
const { createConditionsForSearching, isAuth, checkPermission } = require("../middlewares");

router.get("/", createConditionsForSearching, getGatheringList); // req.query 게더링 조회 라우터
router.get("/random", getRandomGathering); // 유저 정보, 비로그인 에 따라서 게더링 랜덤 조회 라우터
router.get("/upcoming/:userId", isAuth, checkPermission, getGatheringOfUser); //유저의 다가오는 게더링 조회
router.get("/passed/:userId", isAuth, checkPermission, getGatheringOfUser); // 유저의 종료된 게더링 조회
router.post("/", isAuth, createGathering); // 게더링 생성 라우터
router.patch("/", (_, res) => {
  res.status(200).send("일정 종료 라우터");
});
router.get("/:gatheringId", (req, res) => {
  res.status(200).send("일정 참여 라우터");
});
module.exports = router;
