const express = require("express");
const router = express.Router();

router.get("/nickname/:nickname", (_, res) => {
  res.status(200).send("닉네임 체크 라우터");
});
router.get("/email/:email", (_, res) => {
  res.status(200).send("이메일 체크 라우터");
});
router.get("/me", (_, res) => {
  res.status(200).send("로그인 체크 라우터");
});

router.post("/signin", (_, res) => {
  res.status(200).send("로그인 라우터");
});
router.get("/signout", (_, res) => {
  res.status(200).send("로그아웃 라우터");
});
router.post("/signup", (_, res) => {
  res.status(200).send("회원가입 라우터");
});

module.exports = router;
