const express = require("express");
const router = express.Router();
const { isAuth } = require("../middlewares");
const { getUserChatList, joinChatingRoom } = require("../controllers/chat");

router.get("/", isAuth, getUserChatList); // 유저의 채팅리스트 조회
router.get("/:gatheringId", isAuth, joinChatingRoom); // 채팅방 입장

module.exports = router;
