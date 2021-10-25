const express = require("express");
const router = express.Router();

// router.get("/", () => {});
// router.post("/", () => {});
// router.patch("/", () => {});
// router.put("/", () => {});
// router.delete("/", () => {});

router.use((_, res) => {
  res.status(200).send("준비중입니다.");
});

module.exports = router;
