const express = require("express");
const router = express.Router();
const { isAuth } = require("../middlewares");
const { getNotifications, deleteNotification } = require("../controllers/notification");
router.get("/", isAuth, getNotifications); // 노티피케이션 정보 응답
router.delete("/:notificationId", isAuth, deleteNotification);

module.exports = router;
