const express = require("express");
const router = express.Router();
const { isAuth } = require("../middlewares");
const { getUserChatList, joinChatingRoom } = require("../controllers/chat");

router.get("/", isAuth, getUserChatList); // 유저의 채팅리스트 조회
// (채팅에 들어갈 수 있는 조건 = gathering.done = fasle, 모임 날짜가 끝나는 날 까지만 참여 인원수는 이미 게더링에 참여했기 때문에 제외)

router.get("/:gatheringId", isAuth, joinChatingRoom); // 채팅방 입장

module.exports = router;
