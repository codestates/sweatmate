const express = require("express");
const router = express.Router();
const { checkNickname, checkEmail, signup, certifyEmail } = require("../controllers/auth");

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
router.post("/signup", signup);
router.get("/certification/:authKey", certifyEmail);
module.exports = router;
