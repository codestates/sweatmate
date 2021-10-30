const express = require("express");
const router = express.Router();

router.get("/:gatheringId", () => {}); // 채팅방 입장 라우터
router.post("/:gatheringId", () => {}); // 채팅 입력 라우터
router.delete("/:gatheringId/:userId", () => {}); // 호스트의 유저 추방 라우터

module.exports = router;
