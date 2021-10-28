const express = require("express");
const router = express.Router();
const {
  getGatheringList,
  getGatheringOfUser,
  getRandomGathering,
  createGathering,
  endGathering,
  joinGathering,
} = require("../controllers/gathering");
const {
  createConditionsForSearching,
  isAuth,
  checkPermission,
  checkToCreateGathering,
} = require("../middlewares");

router.get("/", createConditionsForSearching, getGatheringList); // req.query 게더링 조회
router.get("/random", getRandomGathering); // 유저 정보, 비로그인 에 따라서 게더링 랜덤 조회
router.get("/upcoming/:userId", isAuth, checkPermission, getGatheringOfUser); //유저의 다가오는 게더링 조회
router.get("/passed/:userId", isAuth, checkPermission, getGatheringOfUser); // 유저의 종료된 게더링 조회
router.post("/", isAuth, checkToCreateGathering, createGathering); // 게더링 생성
router.patch("/:gatheringId", isAuth, endGathering); // 게더링 조기 종료
router.post("/:gatheringId", isAuth, joinGathering);
router.delete("/:gatheringId", (req, res) => {
  res.status(200).send("일정 취소 라우터");
});
module.exports = router;
