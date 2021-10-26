const express = require("express");
const router = express.Router();
const {
  validNickname,
  validEmail,
  signup,
  certifyEmail,
  signin,
  me,
} = require("../controllers/auth");
const { isAuth, checkEmail, checkNickname } = require("../middlewares");

router.get("/nickname/:nickname", checkNickname, validNickname);
router.get("/email/:email", checkEmail, validEmail);
router.get("/me", isAuth, me);
router.post("/signin", signin);
router.get("/signout", (_, res) => {
  res.status(200).send("로그아웃 라우터");
});
router.post("/signup", checkEmail, checkNickname, signup);
router.get("/certification/:authKey", certifyEmail);
module.exports = router;
