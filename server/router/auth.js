const express = require("express");
const router = express.Router();
const { checkNickname, checkEmail, signup, certifyEmail, signin } = require("../controllers/auth");

router.get("/nickname/:nickname", checkNickname);
router.get("/email/:email", checkEmail);
router.get("/me", (_, res) => {
  res.status(200).send("로그인 체크 라우터");
});

router.post("/signin", signin);
router.get("/signout", (_, res) => {
  res.status(200).send("로그아웃 라우터");
});
router.post("/signup", signup);
router.get("/certification/:authKey", certifyEmail);
module.exports = router;
