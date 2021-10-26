const express = require("express");
const router = express.Router();
const { getUerInfo } = require("../controllers/user");
const { isAuth } = require("../middlewares");

router.get("/:userId", isAuth, getUerInfo);
router.put("/:userId", (_, res) => {
  res.status(200).send("유저 정보 수정 라우터");
});
router.delete("/:userId", (_, res) => {
  res.status(200).send("유저 정보 삭제 라우터");
});

module.exports = router;
