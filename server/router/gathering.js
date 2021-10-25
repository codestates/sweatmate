const express = require("express");
const router = express.Router();

router.get("/", (_, res) => {
  res.status(200).send("일정 조회 라우터");
});
router.post("/", (_, res) => {
  res.status(200).send("일정 생성 라우터");
});
router.patch("/", (_, res) => {
  res.status(200).send("일정 종료 라우터");
});
router.get("/random", (_, res) => {
  res.status(200).send("일정 랜덤 조회 라우터");
});
router.get("/upcoming/:userId", (_, res) => {
  res.status(200).send("유저의 다가오는 일정 조회 라우터");
});
router.get("/passed/:userId", (_, res) => {
  res.status(200).send("유저의 지나간 일정 조회 라우터");
});
module.exports = router;
