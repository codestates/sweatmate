const express = require("express");
const router = express.Router();

router.get("/:userId", (_, res) => {
  res.status(200).send("유저 정보 조회 라우터");
});
router.put("/:userId", (_, res) => {
  res.status(200).send("유저 정보 수정 라우터");
});
router.delete("/:userId", (_, res) => {
  res.status(200).send("유저 정보 삭제 라우터");
});

module.exports = router;
