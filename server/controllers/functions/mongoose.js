const mongooseChatModel = require("../../schemas/chat");
const mongooseNotificationModel = require("../../schemas/notification");
const { getCurrentTime } = require("../functions/utility");
module.exports = {
  typeChat: async (room, id, message) => {
    const chatInfo = await mongooseChatModel.findOne({ _id: room });
    const messageInfo = chatInfo.chatLog.create({ id, message, date: getCurrentTime() });
    await chatInfo.chatLog.push(messageInfo);
    const a = await chatInfo.save();
    // const chatInfo = await mongooseChatModel.updateOne(
    //   { _id: room },
    //   { $push: { chatLog: { id, message, date: getCurrentTime() } } }
    // );

    return { ...messageInfo, gatheringInfo: a.chatInfo };
  },
  createNotification: async (userId, gatheringId, type, url, target, message) => {
    const NotificationInfo = mongooseNotificationModel.findOne({ _id: userId });
    const eventInfo = NotificationInfo.notification.create({
      id: gatheringId,
      type,
      url,
      target,
      message,
    });
    await NotificationInfo.notification.push(eventInfo);
    NotificationInfo.save();
    return eventInfo;
  },
  // 회원가입, 게스트로그인, 소셜로그인(처음로그인 시) 기본 값 환영메시지 한개

  // 로그인 시 유저의 알림 목록

  // 회원탈퇴 시 그 유저의 알림 삭제

  // 회원탈토 시 그 유저가 만든 게더링들 같이 삭제
};
