const express = require("express");
const router = express.Router();
const { isAuth } = require("../middlewares");
const { getUserChatList, joinChatingRoom, leaveChatingRoom } = require("../controllers/chat");
router.get("/", isAuth, getUserChatList); // 유저의 채팅리스트 조회
router.get("/:gatheringId", isAuth, joinChatingRoom); // 채팅방 입장
router.delete("/:userId", isAuth, leaveChatingRoom); // 호스트의 게스트 내보내기 or 게스트 모임 나가기

module.exports = router;
