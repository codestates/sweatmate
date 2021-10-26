const express = require("express");
const router = express.Router();
const { checkNickname, checkEmail } = require("../controllers/auth");

router.get("/nickname/:nickname", checkNickname);
router.get("/email/:email", checkEmail);
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
