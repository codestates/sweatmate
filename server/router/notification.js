const express = require("express");
const router = express.Router();

// router.get("/", () => {}); // 노티피케이션 정보 응답
// router.post("/", () => {});
// router.patch("/", () => {});
// router.put("/", () => {});
// router.delete("/", () => {});

router.use((_, res) => {
  res.status(200).send("준비중입니다.");
});

module.exports = router;
