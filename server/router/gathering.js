const express = require("express");
const router = express.Router();
const {
  getGatheringList,
  getGatheringOfUser,
  getRandomGathering,
  createGathering,
  endGathering,
  joinGathering,
  leaveGathering,
} = require("../controllers/gathering");
const { createConditionsForSearching, isAuth, checkToCreateGathering } = require("../middlewares");

router.get("/", createConditionsForSearching, getGatheringList); // req.query 게더링 조회
router.get("/random", getRandomGathering); // 유저 정보, 비로그인 에 따라서 게더링 랜덤 조회
router.get("/upcoming/:userId", isAuth, getGatheringOfUser); //유저의 다가오는 게더링 조회
router.get("/passed/:userId", isAuth, getGatheringOfUser); // 유저의 종료된 게더링 조회
router.post("/", isAuth, checkToCreateGathering, createGathering); // 게더링 생성
router.patch("/:gatheringId", isAuth, endGathering); // 호스트의 게더링 조기 종료, 스케쥴러로 인한 종료
router.post("/:gatheringId", isAuth, joinGathering); // 게더링에 참여
router.delete("/:gatheringId/:userId", isAuth, leaveGathering); // 게더링을 떠남
module.exports = router;
