const express = require("express");
const router = express.Router();
const {
  validNickname,
  validEmail,
  signup,
  certifyEmail,
  signin,
  me,
  signout,
  guestSignin,
  googleSignin,
  kakaoSignin,
} = require("../controllers/auth");
const { isAuth, checkEmail, checkNickname } = require("../middlewares");

router.get("/nickname/:nickname", checkNickname, validNickname);
router.get("/email/:email", checkEmail, validEmail);
router.get("/me", isAuth, me);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/signup", checkEmail, checkNickname, signup);
router.get("/certification/:authKey", certifyEmail);
router.post("/guest", guestSignin);
router.post("/google", googleSignin);
router.post("/kakao", kakaoSignin);
module.exports = router;
